import { render, screen } from "@testing-library/react";
import Form from "./form";

describe('should be when the form is mounted', () => {

    it('should be a create product from page', () => {

        render(<Form />);

        expect(
            screen.getByRole('heading', { name: /create product/i } )
        ).toBeInTheDocument();
    })

    test('should exists fields: name, size, type (electronic, furniture, clothing) and submit button', () => { second })
});