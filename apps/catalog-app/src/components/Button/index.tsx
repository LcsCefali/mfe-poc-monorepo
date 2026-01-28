import React from 'react';

const Button = React.lazy(() => import('rootzz/Button'));
const Title = React.lazy(() => import('rootzz/Button').then(module => ({ default: module.default.Title })));

// Reagrupamos o componente composto para manter a sintaxe <Button.Title>
(Button as any).Title = Title;

export default Button;
