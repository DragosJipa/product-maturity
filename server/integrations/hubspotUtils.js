const axiosInstance = require('./hubspotConfig');

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

        const contactResponse = await axiosInstance.post('/crm/v3/objects/contacts', {
            properties: {
                email: contactData.email,
                firstname: firstname,
                lastname: lastname,
                company: contactData.company,
            }
        });

        console.log('Contact created successfully:', contactResponse.data);

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
        } else {
            console.log('Skipping company association - no company ID provided');
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

        if (!isPersonalEmailDomain(domain)) {
            company = await exports.searchCompanyByNameAndDomain(
                getCompanyNameFromDomain(domain),
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
            company: getCompanyNameFromDomain(domain),
            companyId: company.id
        });

        try {
            const noteContent = `Product Maturity Assessment taken on ${new Date().toLocaleString()}\n` +
                `Organization Type: ${getCompanyNameFromDomain(domain)}\n` +
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
            contact: contact
        };
    } catch (error) {
        console.error('Error in createOrUpdateCompanyAndContact:', error);
        throw error;
    }
};
