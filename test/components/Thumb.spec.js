import Thumb from '../../src/components/Thumb';
import React from 'react';
import {shallow} from 'enzyme';
import {expect} from 'chai';
import Chance from 'chance';
import {stub, assert} from 'sinon';

describe('Thumb Tests', () => {
  let element,
    viewProps,
    chance;

  function doRender(props) {
    element = shallow(<Thumb {...props} />);
  }

  beforeEach('set up', () => {
    chance = new Chance();
    viewProps = {
      onClick: stub(),
      backgroundUrl: chance.url({extensions: ['jpg', 'png']}),
      backgroundPosition: {
        x: chance.integer({min: 1, max: 5}),
        y: chance.integer({min: 1, max: 5})
      },
      height: chance.integer({min: 25, max: 50})
    };

    doRender(viewProps);
  });

  it('should render as a DIV with a css class of "photo-thumb"', () => {
    expect(element.type()).to.equal('div');
    expect(element.prop('className')).to.equal('photo-thumb');
  });

  it('should set style.backgroundImage to the value of props.backgroundUrl', () => {
    expect(element.prop('style').backgroundImage).to.equal(`url('${viewProps.backgroundUrl}')`);
  });

  it('should set style.backgroundImage to the value of props.backgroundUrl', () => {
    expect(element.prop('style').backgroundPosition).to.equal(`${viewProps.backgroundPosition.x}px ${viewProps.backgroundPosition.y}px`);
  });

  it('should set style.height to the value of props.height', () => {
    expect(element.prop('style').height).to.equal(`${viewProps.height}px`);
  });

  it('should set style.width to the value of props.width', () => {
    viewProps.width = chance.integer({min: 55, max: 200});
    doRender(viewProps);

    expect(element.prop('style').width).to.equal(`${viewProps.width}px`);
  });

  it('should set a data-tags attribute with the value of "thumbnail"', () => {
    expect(element.prop('data-tags')).to.contain('thumbnail');
  });

  it('should append any tags in the props.tags array to the data-tags attribute', () => {
    viewProps.tags = [chance.word(), chance.word(), chance.word()];
    doRender(viewProps);

    viewProps.tags.forEach(tag => {
      expect(element.prop('data-tags')).to.contain(tag);
    });
  });

  it('should call props.onThumbClick and give it the thumbnail object when the thumbnail is clicked', () => {
    assert.notCalled(viewProps.onClick);
    element.simulate('click');
    assert.calledWithExactly(viewProps.onClick, Object.assign({}, Thumb.defaultProps, viewProps));
  });
});
