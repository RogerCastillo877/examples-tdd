import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import Form from "./form";
import { setupServer } from 'msw/node'
import { rest } from "msw";
import { CREATED_STATUS, ERROR_SERVER_STATUS, INVALID_REQUEST_STATUS } from "../const/httpStatus";

const server = setupServer(
    rest.post('/products', (req, res, ctx) => {

        const { name, size, type } = req.body;

        if( name && size && type ) {
            return res( ctx.status( CREATED_STATUS ))
        }

        return res( ctx.status( ERROR_SERVER_STATUS ))
    }),
)

beforeAll( () => server.listen() );

afterEach( () => server.resetHandlers() );

afterAll( () => server.close() );

beforeEach( () => render(<Form />) );

afterEach( () => server.resetHandlers() );

describe('should be when the form is mounted', () => {


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

describe('should be when user submit the fomr without vaules',  () => {

    it('should display validation message', () => {
        // render(<Form />)
        
        expect( screen.queryByText(/the name is required/i) ).not.toBeInTheDocument()
        
        fireEvent.click( screen.getByRole( 'button', { name: /submit/i } ) );

        expect( screen.queryByText(/the name is required/i) ).toBeInTheDocument()
        expect( screen.queryByText(/the size is required/i) ).toBeInTheDocument()
        expect( screen.queryByText(/the type is required/i) ).toBeInTheDocument()

  
    });
});

describe('When the user blurs an emty field', () => {

    test('should display a validation error message for input name', () => {
        // render(<Form />)

        expect( screen.queryByText(/the name is required/i) ).not.toBeInTheDocument();

        expect( screen.queryByText(/the size is required/i) ).not.toBeInTheDocument();

        fireEvent.blur( screen.getByLabelText(/size/i), {
            target: { name: 'name', value: '' },
        })

        expect( screen.queryByText(/the name is required/i) ).toBeInTheDocument();
    });
    
    test('should display a validation error message for input size', () => {
        // render(<Form />)

        fireEvent.blur( screen.getByLabelText(/size/i), {
            target: { name: 'size', value: '' },
        })

        expect( screen.queryByText(/the size is required/i) ).toBeInTheDocument()
    });
});

describe('should test when the user submits the form properly and the server returns created status', () => {

    it('should the submit button be desabled until the request is done', async () => {

        const submitBtn = screen.getByRole( 'button', {name: /submit/i} );

        expect( submitBtn ).not.toBeDisabled();

        fireEvent.click( submitBtn );

        expect( submitBtn ).toBeDisabled();

        await waitFor( () => {
            expect( submitBtn ).toBeDisabled();
        })
    })

    it('should display the succes message "Product stored" and clean the field values', async () => {

        const submitBtn = screen.getByRole( 'button', {name: /submit/i} );
        const nameInput = screen.getByLabelText(/name/i)
        const sizeInput = screen.getByLabelText(/size/i)
        const typeSelect = screen.getByLabelText(/type/i)

        fireEvent.change( nameInput, { target: { name: 'name', value: 'My product'} } ) 
        fireEvent.change( sizeInput, { target: { name: 'name', value: '10'} } ) 
        fireEvent.change( typeSelect, { target: { name: 'name', value: 'electronic'} } ) 

        fireEvent.click( submitBtn );

        await waitFor( () => expect( screen.getByText(/product stored/i) ).toBeInTheDocument() )

        expect( nameInput ).toHaveValue('');
        expect( sizeInput ).toHaveValue('');
        expect( typeSelect ).toHaveValue('');
    });
});

describe('should be when the user submits the form and the server returns an unexpectec error', () => {

    it('should be the form page must display the error message "Unexpected error, please try again"', async () => {
        
        const submitBtn = screen.getByRole( 'button', {name: /submit/i} );

        fireEvent.click( submitBtn );

        await waitFor( () => expect( screen.getByText(/unexpected error, please try again/i) ).toBeInTheDocument() )
    })
})

describe('should be when the user submits the form and the server returns an invalid request error', () => {

    it('should be the form page must display the error message "The form is invalid, please try again"', async () => {
        
        const submitBtn = screen.getByRole( 'button', {name: /submit/i} );

        server.use(
            rest.post( '/products', ( req, res, ctx) => {
                return res(
                    ctx.status( INVALID_REQUEST_STATUS ),
                    ctx.json({ message: 'The form is invalid, the fields name, size, type are required' })
                )
            })    
        );

        fireEvent.click( submitBtn );

        await waitFor( () => expect( screen.getByText(/the form is invalid, the fields name, size, type are required/i) ).toBeInTheDocument() )
    })
});

describe('should be when the user submits the form and the server returns an invalid request error', () => {

    it('should be the form page must display the error message "The form is invalid, please try again"', async () => {
        
        const submitBtn = screen.getByRole( 'button', {name: /submit/i} );

        server.use(
            rest.post( '/products', ( req, res) => res.networkError('Failed to connect, please try again'))    
        );

        fireEvent.click( submitBtn );

        await waitFor( () => expect( screen.getByText(/connection error, please try again/i) ).toBeInTheDocument() )
    })
});