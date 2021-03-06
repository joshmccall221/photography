import PromiseMaker from "./promise-maker";
import {statorWithReset} from "./state-utilities";
import {injectOnClick} from "./transform-utilities";
import PhotoScaling from "./transformers/photo-scaling";
import NewestPhotosStrategy from "./view-strategies/newest-photos";
import CollectionInGroupStrategy from "./view-strategies/collection-in-group";
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

const h_scaling = 0.55,
  v_scaling = 0.55;

let ext = {},
  mergeWorld = () => {
  };

function resetEverything() {
  mergeWorld = statorWithReset.bind({});

  mergeWorld({
    transformer: false,
    sorter: false,
    limitRenderTo: false
  });
}

function whenThumbClicked(item) {
  ext.window.open(item.image, 'iowa-light-view-photo');
}

function whenBannerClicked() {
  ext.document.getElementById('photography-app-container').scrollTop = 0;
  mergeWorld({
    sorter: false,
    limitRenderTo: false
  });
  doRender();
}

function whenCollapseToGroupsClicked() {
  let collectionCount = ext.data.reduce((count, g) => {
      return count + g.collections.reduce((itemCount, collection) => itemCount + collection.items.length, 0);
    }, 0),
    nextNewestPhotosStrat = NewestPhotosStrategy.create(ext.data);

  nextNewestPhotosStrat.next(collectionCount);
  mergeWorld({
    sorter: nextNewestPhotosStrat,
    limitRenderTo: 'collectionNames'
  });

  doRender();
}

function whenCollectionNameClicked(collectionName) {
  mergeWorld({
    limitRenderTo: false,
    sorter: CollectionInGroupStrategy.create(ext.data, collectionName)
  });

  doRender();
}

function setUpSorterAndTransformer() {
  if (!mergeWorld().sorter) {
    mergeWorld({
      sorter: NewestPhotosStrategy.create(ext.data)
    });
  }
}

function eventuallyRender(resolve) {
  let currentWorld = mergeWorld(),
    appProps = {
      groups: currentWorld.sorter.next(5),
      limitRenderTo: currentWorld.limitRenderTo,
      whenBannerClicked,
      whenCollapseToGroupsClicked,
      whenCollectionNameClicked
    };

  appProps.groups.forEach(function (g) {
    g.collections.forEach(function (c) {
      injectOnClick(c.items, whenThumbClicked);
    });
  });

  let element = React.createElement(App, appProps);

  ReactDOM.render(
    element,
    ext.document.getElementById('photography-app-container'),
    resolve
  );
}

function doRender() {
  return PromiseMaker.buildPromise(resolve => {
    setUpSorterAndTransformer();
    eventuallyRender(resolve);
  });
}

function doPreStartActions() {
  PhotoScaling.create(h_scaling, v_scaling);
}

resetEverything();

export default {
  withExternals: (nextExt) => ext = nextExt,
  unregisterExternals: () => ext = {},

  prime: (thingsToStartWith) => mergeWorld(thingsToStartWith),

  peerAtWorld: () => mergeWorld(),

  resetMergers: resetEverything,

  whenThumbClicked,
  whenBannerClicked,
  whenCollapseToGroupsClicked,
  whenCollectionNameClicked,

  doPreStartActions,
  doRender
}
