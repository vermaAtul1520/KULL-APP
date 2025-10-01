// Occasion Icons
import React from 'react';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import { AppColors } from '../constants';

export const FamilyIcon = ({ size = 40, color = AppColors.white }) => (
  <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    <Circle cx="32" cy="20" r="8" fill={AppColors.warning}/>
    <Path d="M20 50C20 42 25 38 32 38S44 42 44 50" fill={AppColors.warning}/>
    <Circle cx="20" cy="25" r="4" fill={AppColors.warning} opacity="0.7"/>
    <Circle cx="44" cy="25" r="4" fill={AppColors.warning} opacity="0.7"/>
  </Svg>
);

export const BabyIcon = ({ size = 40, color = AppColors.white }) => (
  <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    <Circle cx="32" cy="24" r="12" fill={AppColors.blue}/>
    <Circle cx="28" cy="20" r="2" fill={AppColors.white}/>
    <Circle cx="36" cy="20" r="2" fill={AppColors.white}/>
    <Path d="M28 28C30 30 34 30 36 28" stroke={AppColors.white} strokeWidth="2" fill="none"/>
    <Rect x="26" y="36" width="12" height="20" rx="6" fill={AppColors.blue}/>
  </Svg>
);

export const BoysMarriageIcon = ({ size = 40, color = AppColors.white }) => (
  <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    <Circle cx="26" cy="20" r="8" fill={AppColors.orange}/>
    <Path d="M16 45C16 40 20 36 26 36S36 40 36 45" fill={AppColors.orange}/>
    <Circle cx="40" cy="22" r="6" fill={AppColors.pink} opacity="0.7"/>
    <Path d="M30 32L42 32" stroke={color} strokeWidth="3"/>
    <Circle cx="36" cy="32" r="3" fill={color}/>
  </Svg>
);

export const GirlsMarriageIcon = ({ size = 40, color = AppColors.white }) => (
  <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    <Circle cx="32" cy="20" r="8" fill={AppColors.purple}/>
    <Path d="M22 45C22 40 26 36 32 36S42 40 42 45" fill={AppColors.purple}/>
    <Path d="M26 14C26 10 28 8 32 8S38 10 38 14" stroke={AppColors.purple} strokeWidth="2" fill="none"/>
    <Circle cx="28" cy="12" r="2" fill={AppColors.purple}/>
    <Circle cx="36" cy="12" r="2" fill={AppColors.purple}/>
  </Svg>
);

export const DeathIcon = ({ size = 40, color = AppColors.white }) => (
  <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    <Rect x="24" y="20" width="16" height="32" rx="2" fill={AppColors.gray}/>
    <Rect x="20" y="16" width="24" height="8" rx="4" fill={AppColors.gray}/>
    <Path d="M28 24L28 44M36 24L36 44M32 28L32 40" stroke={AppColors.white} strokeWidth="1"/>
  </Svg>
);

export const BackIcon = ({ size = 24, color = AppColors.white }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M19 12H5M12 19L5 12L12 5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

export const PdfIcon = ({ size = 24, color = AppColors.white }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" fill={color}/>
  </Svg>
);

export const VideoIcon = ({ size = 24, color = AppColors.white }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M17,10.5V7A1,1 0 0,0 16,6H4A1,1 0 0,0 3,7V17A1,1 0 0,0 4,18H16A1,1 0 0,0 17,17V13.5L21,17.5V6.5L17,10.5Z" fill={color}/>
  </Svg>
);

export const ImageIcon = ({ size = 24, color = AppColors.white }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M8.5,13.5L11,16.5L14.5,12L19,18H5M21,19V5C21,3.89 20.1,3 19,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19Z" fill={color}/>
  </Svg>
);
