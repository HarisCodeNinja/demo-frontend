import * as Fa6Icons from 'react-icons/fa6';
import * as FaIcons from 'react-icons/fa';

const AllIcons = { ...FaIcons, ...Fa6Icons };
export const GetFontIcon = (iconName:string) =>{
  const IconComponent = AllIcons[iconName as keyof typeof AllIcons];
  return IconComponent ? <IconComponent /> : undefined;
}