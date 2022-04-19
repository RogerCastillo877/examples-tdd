import { render, screen } from "@testing-library/react";
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