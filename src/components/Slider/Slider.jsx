import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { getRandomNumber, getNextRoundRobin } from '../../lib/utils';
import { Img } from './style';
import { DEFAULT_BANNER_IMAGE, PUBLIC_IMAGE_FOLDER } from '../../configs/Constants';

const Slider = (props) => {
  const [imageIndex, setCount] = useState(0);
  const {
    altText, banners, height, random, defaultBanner, duration,
  } = props;

  useEffect(() => {
    const interval = setInterval(() => {
      const updatedCount = imageIndex + 1;
      setCount(updatedCount);
    }, duration);
    return () => clearInterval(interval);
  }, [imageIndex]);
  const index = random
    ? getRandomNumber(banners.length)
    : getNextRoundRobin(banners.length, imageIndex);
  const bannerImage = banners.length ? `${PUBLIC_IMAGE_FOLDER}${banners[index]}` : `${PUBLIC_IMAGE_FOLDER}${defaultBanner}`;

  return (
    <>
      <Img
        src={bannerImage}
        alt={altText}
        height={height}
      />
    </>
  );
};

Slider.defaultProps = {
  altText: 'Default Banner',
  defaultBanner: DEFAULT_BANNER_IMAGE,
  duration: 2000,
  height: 200,
  random: false,
};

Slider.propTypes = {
  altText: PropTypes.string,
  banners: PropTypes.array.isRequired,
  defaultBanner: PropTypes.string,
  duration: PropTypes.number,
  height: PropTypes.number,
  random: PropTypes.bool,
};

export default Slider;
