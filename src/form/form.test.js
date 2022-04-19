import { fireEvent, render, screen } from "@testing-library/react";
import Form from "./form";

describe('should be when the form is mounted', () => {

    beforeEach( () => render(<Form />) );

    it('should be a create product from page', () => {

        expect(
            screen.getByRole('heading', { name: /create product/i } )
        ).toBeInTheDocument();
    });

    test('should exists fields: name, size, type (electronic, furniture, clothing)', () => {

        expect( screen.getByLabelText(/name/i) ).toBeInTheDocument();
        expect( screen.getByLabelText(/size/i) ).toBeInTheDocument();
        expect( screen.getByLabelText(/type/i) ).toBeInTheDocument();

        expect( screen.queryByText(/electronic/i) ).toBeInTheDocument();
        expect( screen.queryByText(/furniture/i) ).toBeInTheDocument();
        expect( screen.queryByText(/clothing/i) ).toBeInTheDocument();
    });

    test('should exists the submit button', () => {

        expect( screen.getByRole('button', { name: /submit/i }) ).toBeInTheDocument()
    });
});

describe('should be when user submit the fomr without vaules', () => {

    it('should display validation message', () => {
        render(<Form />)
        
        expect( screen.queryByText(/the name is required/i) ).not.toBeInTheDocument()
        
        fireEvent.click( screen.getByRole( 'button', { name: /submit/i } ) );

        expect( screen.queryByText(/the name is required/i) ).toBeInTheDocument()
        expect( screen.queryByText(/the size is required/i) ).toBeInTheDocument()
        expect( screen.queryByText(/the type is required/i) ).toBeInTheDocument()
    });
});