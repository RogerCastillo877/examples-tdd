import { render, screen } from "@testing-library/react"
import AsyncList from "./async-list"

test('should display the food data', async() => {
    render(<AsyncList />)

    const hamburger = await screen.findByText(/hamburger/i);

    expect( hamburger ).toBeInTheDocument();
})