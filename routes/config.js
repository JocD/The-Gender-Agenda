var Config = {
    dev: {
        contact: 'jdukes22@gmail.com',
        server: 'www.jacquesdukes.com'
    },
    prd: {
        contact: 'host@thegenderagenda.com',
        server: '128.199.152.181'
    },

    getConfig: function () {
        if (process.env.NODE_ENV === 'production') {
            return Config.prd;
        }

        else {
            return Config.dev;
        }
    }
};

module.exports = Config;