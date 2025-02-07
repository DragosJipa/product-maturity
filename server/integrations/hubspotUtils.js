const logger = require('../config/logger');
const axiosInstance = require('./hubspotConfig');
const FormData = require('form-data');
const { Readable } = require('stream');
const axios = require('axios');

const VALID_FOCUS_AREAS = {
    'strategy': 'Strategy',
    'technology': 'Technology',
    'process': 'Process',
    'culture': 'Culture'
};

function correctFocusArea(area) {
    if (!area) return null;
    const normalized = area.trim().toLowerCase();
    return VALID_FOCUS_AREAS[normalized] || null;
}

const isPersonalEmailDomain = (domain) => {
    const personalDomains = [
        'gmail.com',
        'yahoo.com',
        'hotmail.com',
        'outlook.com',
        'aol.com',
        'icloud.com',
        'mail.com',
        'proton.me',
        'protonmail.com',
        'me.com',
        'live.com',
        'msn.com'
    ];
    return personalDomains.includes(domain.toLowerCase());
};

const getCompanyNameFromDomain = (domain) => {
    const companyName = domain
        .replace(/\.(com|org|net|edu|gov|mil|biz|info|io|co|uk|de|fr|it|nl|eu)$/g, '')
        .split('.')
        .pop()
        .replace(/[-_]/g, ' ')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');

    return companyName;
};

const formatNameFromEmail = (email) => {
    const namePart = email.split('@')[0];

    let cleanName = namePart
        .replace(/\d+/g, '')
        .replace(/[-._]/g, ' ')
        .trim();

    cleanName = cleanName.replace(/([a-z])([A-Z])/g, '$1 $2');

    const parts = cleanName
        .split(' ')
        .filter(part => part.length > 0)
        .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase());

    return {
        firstname: parts[0] || '',
        lastname: parts.slice(1).join(' ') || ''
    };
};

exports.createCompany = async (companyData) => {
    const url = '/crm/v3/objects/companies';

    const properties = {
        name: getCompanyNameFromDomain(companyData.domain),
        domain: companyData.domain
    };

    try {
        console.log('Creating company with properties:', properties);
        const response = await axiosInstance.post(url, { properties });
        console.log('Company created successfully:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error creating company:', error.response?.data || error.message);
        throw error;
    }
};

exports.createContact = async (contactData) => {
    try {
        const { firstname, lastname } = formatNameFromEmail(contactData.email);

        // First search for existing contact
        const searchResponse = await axiosInstance.post('/crm/v3/objects/contacts/search', {
            filterGroups: [{
                filters: [{
                    propertyName: 'email',
                    operator: 'EQ',
                    value: contactData.email
                }]
            }]
        });

        let contactResponse;
        if (searchResponse.data.total > 0) {
            // Update existing contact
            const existingContact = searchResponse.data.results[0];
            contactResponse = await axiosInstance.patch(
                `/crm/v3/objects/contacts/${existingContact.id}`,
                {
                    properties: {
                        firstname: firstname,
                        lastname: lastname,
                        company: contactData.company,
                    }
                }
            );
            console.log('Contact updated successfully:', contactResponse.data);
        } else {
            // Create new contact
            contactResponse = await axiosInstance.post('/crm/v3/objects/contacts', {
                properties: {
                    email: contactData.email,
                    firstname: firstname,
                    lastname: lastname,
                    company: contactData.company,
                }
            });
            console.log('Contact created successfully:', contactResponse.data);
        }

        // Handle company association
        if (contactResponse.data.id && contactData.companyId) {
            try {
                await axiosInstance.put(
                    `/crm/v3/objects/contacts/${contactResponse.data.id}/associations/companies/${contactData.companyId}/contact_to_company`,
                    {}
                );
                console.log('Contact associated with company successfully');
            } catch (associationError) {
                console.error('Error associating contact with company:', associationError.response?.data);
            }
        }

        return contactResponse.data;
    } catch (error) {
        console.error('Error creating contact:', error.response?.data || error.message);
        throw error;
    }
};

exports.searchCompanyByNameAndDomain = async (companyName, domainName) => {
    const url = '/crm/v3/objects/companies/search';
    const requestBody = {
        "filterGroups": [
            {
                "filters": [
                    { "propertyName": "name", "operator": "CONTAINS_TOKEN", "value": companyName }
                ]
            },
            {
                "filters": [
                    { "propertyName": "domain", "operator": "EQ", "value": domainName }
                ]
            }
        ],
        "properties": ["name", "domain", "website", "industry", "phone_number", "city"],
        "limit": 10,
        "after": 0
    };

    try {
        const response = await axiosInstance.post(url, requestBody);
        return response.data.results.length > 0 ? response.data.results[0] : null;
    } catch (error) {
        console.error('Error searching for company:', error.response ? `${error.response.status}: ${error.response.statusText}` : error.message);
        throw error;
    }
};

exports.createNote = async (companyId, contactId, noteContent) => {
    try {
        const noteResponse = await axiosInstance.post('/crm/v3/objects/notes', {
            properties: {
                hs_note_body: noteContent,
                hs_timestamp: Date.now().toString()
            }
        });

        console.log('Note created successfully:', noteResponse.data);
        const noteId = noteResponse.data.id;

        if (noteId && (companyId || contactId)) {
            if (companyId) {
                try {
                    await axiosInstance.put(
                        `/crm/v3/objects/notes/${noteId}/associations/companies/${companyId}/note_to_company`,
                        {}
                    );
                    console.log('Company association created successfully');
                } catch (companyAssocError) {
                    console.error('Error creating company association:', companyAssocError.response?.data);
                }
            }

            if (contactId) {
                try {
                    await axiosInstance.put(
                        `/crm/v3/objects/notes/${noteId}/associations/contacts/${contactId}/note_to_contact`,
                        {}
                    );
                    console.log('Contact association created successfully');
                } catch (contactAssocError) {
                    console.error('Error creating contact association:', contactAssocError.response?.data);
                }
            }
        }

        return noteResponse.data;
    } catch (error) {
        console.error('Error details:', {
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data,
            url: error.config?.url,
            method: error.config?.method,
            requestData: error.config?.data
        });
        throw error;
    }
};

exports.createOrUpdateCompanyAndContact = async (formData) => {
    try {
        const domain = formData.email.split('@')[1].toLowerCase();
        let company = null;
        const companyName = getCompanyNameFromDomain(domain);

        if (!isPersonalEmailDomain(domain)) {
            company = await exports.searchCompanyByNameAndDomain(
                companyName,
                domain
            );

            if (!company) {
                company = await exports.createCompany({
                    domain: domain,
                    organizationType: formData.organizationType
                });
            }

            console.log('Company details:', {
                id: company?.id,
                properties: company?.properties
            });
        } else {
            console.log(`Skipping company creation for personal email domain: ${domain}`);
        }

        const contact = await exports.createContact({
            email: formData.email,
            company: companyName,
            companyId: company?.id
        });

        try {
            const noteContent = `Product Maturity Assessment taken on ${new Date().toLocaleString()}\n` +
                `Organization Type: ${companyName}\n` +
                `Email: ${formData.email}`;

            const noteResult = await exports.createNote(
                company.id,
                contact.id,
                noteContent
            );

            console.log('Note creation result:', noteResult);
        } catch (noteError) {
            console.error('Error creating note:', noteError);
        }

        return {
            company: company,
            contact: contact,
        };
    } catch (error) {
        console.error('Error in createOrUpdateCompanyAndContact:', error);
        throw error;
    }
};

exports.handleEmailSubmission = async (email) => {
    try {
        const domain = email.split('@')[1].toLowerCase();
        let company = null;
        const companyName = getCompanyNameFromDomain(domain);

        if (!isPersonalEmailDomain(domain)) {
            company = await exports.searchCompanyByNameAndDomain(
                companyName,
                domain
            );

            if (!company) {
                company = await exports.createCompany({
                    domain: domain,
                });
            }
        } else {
            console.log(`Skipping company creation for personal email domain: ${domain}`);
        }

        const contact = await exports.createContact({
            email: email,
            company: companyName,
            companyId: company.id
        });

        const assessment = await createOrUpdateAssessment({
            email: email,
            companyId: company?.id,
            contactId: contact.id,
            isCompleted: false,
        });

        try {
            const noteContent = `Product Maturity Assessment started on ${new Date().toLocaleString()}\n` +
                `Organization Type: ${companyName}\n` +
                `Email: ${email}`;

            const noteResult = await exports.createNote(
                company.id,
                contact.id,
                noteContent
            );

            console.log('Note creation result:', noteResult);
        } catch (noteError) {
            console.error('Error creating note:', noteError);
        }

        return {
            company,
            contact,
            assessment,
        };
    } catch (error) {
        console.error('Error handling email submission:', error);
        return false;
    }
};


const createOrUpdateAssessment = async (data) => {
    try {
        console.log('Creating or updating assessment:', data);
        const ASSESSMENT_PROPERTY = process.env.NODE_ENV === 'production'
            ? 'assessment_name'
            : 'product_maturity_assessment';

        const searchResponse = await axiosInstance.post('/crm/v3/objects/assessments/search', {
            filterGroups: [{
                filters: [{
                    propertyName: ASSESSMENT_PROPERTY,
                    operator: 'EQ',
                    value: data.email
                }]
            }]
        });

        const properties = {
            [ASSESSMENT_PROPERTY]: data.email || 'Product Maturity Assessment',
            assessment_status: data.isCompleted ? 'Completed' : 'Started',
            strategy_score: data.scores?.strategy || 0,
            technology_score: data.scores?.technology || 0,
            process_score: data.scores?.process || 0,
            culture_score: data.scores?.culture || 0,
            total_score: data.scores?.total || 0,
        };

        let assessmentResponse;
        if (searchResponse.data.total > 0) {
            // Update existing assessment
            const existingAssessment = searchResponse.data.results[0];
            assessmentResponse = await axiosInstance.patch(
                `/crm/v3/objects/assessments/${existingAssessment.id}`,
                { properties }
            );
        } else {
            // Create new assessment
            assessmentResponse = await axiosInstance.post(
                '/crm/v3/objects/assessments',
                { properties }
            );
        }

        console.log('Assessment created/updated successfully:', assessmentResponse.data);


        // Create associations if companyId and contactId exist
        if (assessmentResponse.data.id) {
            try {
                if (data.companyId) {
                    const objectName = process.env.NODE_ENV === 'production' ? 'company' : 'companies';
                    await axiosInstance.put(
                        `/crm/v4/objects/assessments/${assessmentResponse.data.id}/associations/default/${objectName}/${data.companyId}`
                    );
                    console.log('Company association created successfully');
                }

                if (data.contactId) {
                    const objectName = process.env.NODE_ENV === 'production' ? 'contact' : 'contacts';
                    await axiosInstance.put(
                        `/crm/v4/objects/assessments/${assessmentResponse.data.id}/associations/default/${objectName}/${data.contactId}`
                    );
                    console.log('Contact association created successfully');
                }
            } catch (associationError) {
                console.error('Error creating associations:', associationError.response?.data);
                throw associationError;
            }
        }

        return assessmentResponse.data;
    } catch (error) {
        console.error('Error in assessment operation:', error.response?.data || error.message);
        throw error;
    }
};

const uploadFileToHubSpot = async (fileBuffer, fileName) => {
    try {
        // Ensure fileBuffer is Buffer
        const buffer = Buffer.from(fileBuffer);

        const form = new FormData();
        form.append('file', buffer, {
            filename: fileName,
            contentType: 'application/pdf',
            knownLength: buffer.length
        });
        form.append('folderPath', '/');
        form.append('options', JSON.stringify({ access: 'PUBLIC_INDEXABLE', overwrite: true }));

        const response = await axios({
            method: 'post',
            url: 'https://api.hubapi.com/filemanager/api/v3/files/upload',
            headers: {
                ...form.getHeaders(),
                'Authorization': `Bearer ${process.env.HUBSPOT_OAUTH_TOKEN}`
            },
            data: form,
            maxContentLength: Infinity,
            maxBodyLength: Infinity
        });

        return response.data;
    } catch (error) {
        console.error('Error uploading pdf file to HubSpot:', error.response?.data || error.message);
        throw error;
    }
};

exports.updateAssessmentScores = async (assessmentId, scores, detailedReport, pdfBuffer, focusArea1, focusArea2,
    currentStage, currentStageDescription, currentStrengths, currentOpportunities) => {
    try {
        const correctedArea1 = correctFocusArea(focusArea1);
        const correctedArea2 = correctFocusArea(focusArea2);
        console.log('Corrected focus areas:', correctedArea1, correctedArea2);

        console.log('mia ajuns aici', currentStrengths, currentOpportunities);

        const current_stage = process.env.NODE_ENV === 'production'
            ? 'product_maturity__current_stage'
            : 'current_stage';
        const current_stage_description = process.env.NODE_ENV === 'production'
            ? 'product_maturity__current_stage_description'
            : 'current_stage_description';
        const strengths = process.env.NODE_ENV === 'production'
            ? 'product_maturity__strengths'
            : 'strengths';
        const opportunities = process.env.NODE_ENV === 'production'
            ? 'product_maturity__opportunities'
            : 'opportunities';
        const report_pdf = process.env.NODE_ENV === 'production'
            ? 'report_pdf'
            : 'pdf';

        const fileUploadResponse = await uploadFileToHubSpot(pdfBuffer, 'product-maturity-assessment-report.pdf');
        console.log('PDF uploaded to HubSpot:', fileUploadResponse);
        const fileUrl = fileUploadResponse.objects[0].url;

        return await axiosInstance.patch(`/crm/v3/objects/assessments/${assessmentId}`, {
            properties: {
                assessment_status: 'Completed',
                strategy_score: scores.strategy,
                technology_score: scores.technology,
                process_score: scores.process,
                culture_score: scores.culture,
                total_score: scores.total,
                detailed_report: detailedReport,
                [report_pdf]: fileUrl,
                focus_area_1: correctedArea1,
                focus_area_2: correctedArea2,
                [current_stage]: currentStage,
                [current_stage_description]: currentStageDescription,
                [strengths]: currentStrengths,
                [opportunities]: currentOpportunities
            }
        });
    } catch (error) {
        console.error('Error updating assessment scores:', error);
        throw error;
    }
};

