import { fireEvent, render, screen } from "@testing-library/react";
import Counter from "./counter";

test('should display zero initial counts', () => {
    render(<Counter />);

    const result = screen.getByText(/clicked times: 0/i); 
    expect( result ).toBeInTheDocument();
});

test('should display new counter after one click', () => {
    render(<Counter />);

    const button = screen.getByText(/click/i, { selector: 'button' });
    fireEvent.click(button)

    const result = screen.getByText(/clicked times: 1/i); 
    expect( result ).toBeInTheDocument();
});