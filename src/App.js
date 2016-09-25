import React from 'react';
import Thumb from './components/Thumb';

const months = [
  'January', 'February', 'March',
  'April', 'May', 'June', 'July',
  'August', 'September', 'October',
  'November', 'December'
];

function getItems(items) {
  return items.map((item, key) => {
    return <li key={`item-${key}`}>
      <Thumb {...item} />
    </li>;
  });
}

function getCollections(group, collections) {
  return collections.map((c, key) => {
    let datetime = new Date(c.time);
    return <li key={`collection-${key}`}>
      <h4 className="collection-name-and-time">{`${group.group}: ${months[datetime.getMonth()]} ${datetime.getDate()}, ${datetime.getFullYear()}`}</h4>
      <ol className="collection-items">{ getItems(c.items) }</ol>
    </li>;
  });
}

function getGroups(groups) {
  return groups.map((g, key) => {
    return <li key={`group-${key}`}>
      <ol className="group-collections">{ getCollections(g, g.collections) }</ol>
    </li>;
  });
}

class App extends React.Component {
  componentDidMount() {
    require('./sass/app.scss');
  }

  render() {
    return <div className="iowa-light-application">
      <div className="iowa-light-banner"
           onClick={this.props.whenBannerClicked}
           onTouchEnd={this.props.whenBannerClicked}>
        <h1>Iowa Light</h1>
      </div>
      <div className="iowa-light-controls"
           onClick={this.props.whenCollapseToGroupsClicked}
           onTouchEnd={this.props.whenCollapseToGroupsClicked}/>
      <ol className="photo-groups">{ getGroups(this.props.groups) }</ol>
    </div>;
  }
}

export default App;
