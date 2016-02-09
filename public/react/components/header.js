var Header = React.createClass({
    getInitialState: function () {
        return {
            categories: []
        };
    },

    componentDidMount: function () {
        this.serverRequest = $.get(this.props.source, function (data) {
            this.setState({
                categories: data
            });
        }.bind(this));

        // create sidebar and attach to menu open
        $('.ui.sidebar')
            .sidebar('attach events', '.toc.item');
    },

    componentWillUnmount: function () {
        this.serverRequest.abort();
    },

    render: function () {
        var categories = this.state.categories;
        var categoryHTML = [];
        for (var i = 0; i < categories.length; i++) {
            var category = categories[i];
            if (category.id !== 1) {
                var categoryName = category.name;
                var link = "/?category=" + categoryName;
                if(category.id === 51){
                    categoryHTML.unshift(<a href={link} className="item">{categoryName}</a>);
                }
                else {
                    categoryHTML.push(<a href={link} className="item">{categoryName}</a>);
                }
            }
        }
        return (
            <div className="ui header no margin">
                <div className="ui eight item pointing sharp border menu padded grid">
                    <div className="mobile tablet only row">
                        <a className="item">
                            <img src="/img/logo.png" width="128" alt="The Gender Agenda" className="ui image"/></a>
                        <div className="right menu"><a className="toc item">
                            <i className="sidebar icon">
                            </i>
                        </a>
                        </div>
                    </div>
                    <div className="computer only centered row">
                        <a href="/" className="item">
                            <img src="/img/logo-icon.png" height="32" alt="The Gender Agenda"
                                 className="ui image"/>
                        </a>
                        {categoryHTML}
                        <div className="ui dropdown item">About
                            <i className="dropdown icon">
                            </i>
                            <div className="menu">
                                <div className="item"><a href="/about">Our Story</a></div>
                                <div className="item"><a href="/about/hosts">People</a></div>
                                <div className="item"><a href="/about/faq">FAQ</a></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});

ReactDOM.render(
    <Header
        source="https://www.jacquesdukes.com/wordpress/dev/wp-json/wp/v2/categories"/>, document.getElementById("header")
);