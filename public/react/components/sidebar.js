var Sidebar = React.createClass({
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
            <div>
                <a href="/" className="logo">
                    <img src="img/logo-icon.png" height="100" alt="The Gender Agenda"/>
                </a>
                {categoryHTML}
                <div className="item">
                    About
                    <a className="item" href="/about">
                        Our Story
                    </a>
                    <a className="item" href="/about/hosts">
                        People
                    </a>
                    <a className="item" href="/about/faq">
                        FAQ
                    </a>
                </div>
            </div>
        );
    }
});

ReactDOM.render(
    <Sidebar
        source="https://www.jacquesdukes.com/wordpress/dev/wp-json/wp/v2/categories"/>, document.getElementById("sidebar")
);