var FloatingHeaderBar = React.createClass({
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
    },

    componentWillUnmount: function () {
        this.serverRequest.abort();
    },

    render: function () {
        var categories = this.state.categories;
        var categoryHTML = [];
        for (var i = 0; i < categories.length; i++) {
            if (categories[i].id !== 1) {
                var categoryName = categories[i].name;
                var link = "/?category=" + categoryName;
                categoryHTML.push(<a href={link} className="item">{categoryName}</a>);
            }
        }
        return (
            <div className="ui small top fixed eight item menu transition hidden computer tablet only">
                <a href="/" className="item">
                    <img className="ui image" src="img/logo-icon.png" height="32" alt="The Gender Agenda"/>
                </a>
                {categoryHTML}
                <div className="ui dropdown item">
                    About
                    <i className="dropdown icon">
                    </i>
                    <div className="menu">
                        <div className="item">
                            <a href="/about">
                                Our Story
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});

ReactDOM.render(
    <FloatingHeaderBar
        source="https://www.jacquesdukes.com/wordpress/dev/wp-json/wp/v2/categories"/>, document.getElementById("floating-header-bar")
);