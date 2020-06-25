import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";


class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      items: [],
      nowCata: "All"
    };
  }

  switchCata(e) {
    this.setState({ nowCata: e.target.innerText })
  }

  backMainPage(e) {
    console.log(e.target)
    this.setState({ nowCata: "All" })
  }

  windowChangeContent() {
    let nowUrl = window.location.href
    let add = nowUrl.split('/')
    console.log(add[add.length - 1])
    let point = add[add.length - 1]
    if (point === "start") {
      this.setState({ nowCata: "快速開始" })
    } else if (point === "react") {
      this.setState({ nowCata: "React 基礎" })
    } else if (point === "redux") {
      this.setState({ nowCata: "Redux 基礎" })
    } else {
      this.setState({ nowCata: "All" })
    }
  }

  componentDidMount() {
    fetch("https://cwpeng.github.io/live-records-samples/data/content.json")
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            items: result
          });
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      )

    window.addEventListener('popstate', () => { this.windowChangeContent() })
    this.windowChangeContent()
    
  }

  render() {
    const { error, isLoaded, items } = this.state;

    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
      console.log(items)
      return (
        <div>
          <div>Midterm Exam</div>
          <Nav navData={items.chapters} switchBtn={this.switchCata.bind(this)} />
          <Content item={items} nowCata={this.state.nowCata} switchBtn={this.backMainPage.bind(this)} />
        </div>
      );
    }
  }
}

//===========以上 Ajax & state 集中處==============


class Nav extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Router>
        <div>
          <nav>
            <ul>
              {this.props.navData.map((cata) => {
                console.log(cata)
                return (
                  <li key={cata.key} onClick={this.props.switchBtn}>
                    <Link to={cata.key}>{cata.title}</Link>
                  </li>
                )
              })}
            </ul>
          </nav>

          <Switch>
            {this.props.navData.map((cata) => {
              console.log(cata)
              return (
                <Route path={cata.key}>
                  {/* <MyComponent /> */}
                </Route>
              )
            })
            }
          </Switch>
        </div>
      </Router>

    )
  }
}

//===========以上 Nav=============


class Content extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    if (this.props.nowCata === "All") {
      console.log('All!')
      return (
        <div className="content">
          <h1>{this.props.item.headline}</h1>
        </div>
      )
    } else {
      let contentItem
      contentItem = this.props.item.chapters.filter(section => section.title === this.props.nowCata)
      console.log(contentItem)

      return (
        <div className="content">
          {contentItem[0].sections.map((section, index) => {
            return (
              <li key={index}>{section}</li>
            )
          })}
          <Router>
            <div>
              <li key="all" onClick={this.props.switchBtn}>
                <Link to="/dist/">回首頁</Link></li>
              <Switch>
                <Route path="/dist/">
                  {/* <MyComponent /> */}
                </Route>
              </Switch>
            </div>
          </Router>
        </div>
      )

    }
  }


}

//============以上 section 區域==============

ReactDOM.render(
  <MyComponent />,
  document.getElementById('root')
);
