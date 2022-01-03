import React, { Component } from 'react';
import { getDisplayName } from '../getDisplayName';

export const ServiceContext = React.createContext({});

const pick = (obj, arr) =>
  arr.reduce((acc, curr) => (curr in obj && (acc[curr] = obj[curr]), acc), {});

export const withServices = (serviceNames) => (WrappedComponent) => {
  const WithServices = (props) => (
    <ServiceContext.Consumer>
      {(services) => (
        <WrappedComponent
          {...pick(services, serviceNames)}
          {...props}
        />
      )}
    </ServiceContext.Consumer>
  );

  WithServices.displayName = `WithServices(${getDisplayName(WrappedComponent)})`;

  return WithServices;
};

export const withServicesProvider = (selectServices) => (WrappedComponent) => {
  class ServicesProvider extends Component {
    constructor(props) {
      super(props);
      this.services = selectServices();
    }
    render() {
      return (
        <ServiceContext.Provider value={this.services}>
          <WrappedComponent {...this.props} />
        </ServiceContext.Provider>
      );
    }
  }

  ServicesProvider.displayName = `ServicesProvider(${getDisplayName(WrappedComponent)})`;

  return ServicesProvider;
};
