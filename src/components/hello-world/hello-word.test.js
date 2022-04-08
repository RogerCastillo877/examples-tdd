import { React } from 'react';
import { render, screen } from '@testing-library/react';
import HelloWorld from './hello-world';

test('should render helloWorld', () => {
    
    render(
        <HelloWorld />);
    screen.debug();

    const title = screen.getByText(/hello world/i)
    expect( title ).toBeInTheDocument();
});