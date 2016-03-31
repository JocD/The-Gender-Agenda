var Config = {
  dev: {
    contact: 'jdukes22@gmail.com',
    server: 'www.jacquesdukes.com/wordpress/dev',
    applicationPassword: '2B53 mBHn CcHt zkXv'
  },
  prd: {
    contact: 'host@thegenderagenda.com',
    server: 'www.thegenderagenda.com//wordpress',
    applicationPassword: 'OJZJ f6vU mQeq pgRu'
  },

  logo: {
    url: "/img/logo.png",
    title: "Gender Agenda",
    alt: "Gender Agenda"
  },

  logoIcon: {
    url: "/img/logo-icon.png",
    title: "Gender Agenda",
    alt: "Gender Agenda"
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