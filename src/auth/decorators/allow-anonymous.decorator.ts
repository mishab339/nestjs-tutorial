export const AllowAnonymous = () => {
  return (target: any, propertyKey: string, propertyDescription: PropertyDescriptor) => {
    console.log('The allow anonymous decorator is called!' + propertyKey);
  };
};
