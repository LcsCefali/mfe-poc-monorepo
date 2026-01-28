import { type PropsWithChildren } from 'react';

const ErrorBoundary: React.FC<PropsWithChildren> = ({ children }) => {
  return <>{children}</>;
};

export default ErrorBoundary;
