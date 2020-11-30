import { render, screen } from '@testing-library/react';
import App from './App';
import RegistrationForm from './components/register';

window.matchMedia = window.matchMedia || function () {
  return {
    matches: false,
    addListener: function () { },
    removeListener: function () { }
  };
};

describe('App', () => {
  test('renders APP component', () => {
    render(<App />);

    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();

    //screen.debug();
  })
})

describe('App Render check for login button', () => {
  test('renders APP component and check if the login button is in the document.', () => {
    render(<App />);
    expect(screen.getByText('Login')).toBeInTheDocument();
  })
})

describe('App Render check for logout button', () => {
  test('renders APP component and check if the logout button is in the document.', () => {
    render(<App />);
    expect(screen.getByText('Logout')).toBeInTheDocument();
  })
})

describe('App Render check inexistent text', () => {
  test('renders APP component and check if a text is not there.', () => {
    render(<App />);
    expect(screen.queryByText(/204COM/)).toBeNull();
  })
})

describe('App Render List high priority button', () => {
  test('renders APP component and check if List high priority button is in the document.', () => {
    render(<App />);
    expect(screen.getByText('List High Priority Only')).toBeInTheDocument();
  })
})

describe('App Render Created for 304CEM Assignment by Gheorghe Craciun text', () => {
  test('renders APP component and check Created for 304CEM Assignment by Gheorghe Craciun text is in the document.', () => {
    render(<App />);
    expect(screen.getByText('Created for 304CEM Assignment by Gheorghe Craciun')).toBeInTheDocument();
  })
})

describe('App Menu Role', () => {
  test('renders App component and checks for role menu', () => {
    render(<App />);
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });
});

// describe('App MenuItem Role', () => {
//   test('renders App component and checks for role menuItem', () => {
//     render(<App />);
//     expect(screen.getByRole('menuitem')).toBeInTheDocument();
//   });
// });

describe('App Button Role', () => {
  test('renders App component and checks for role Button', () => {
    render(<App />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});


// TODO fdsafsdafsdfas mudafdsafas para outro ficheiror

// describe('RealEstateGrid', () => {
//   test('renders RealEstateGrid component', () => {
//         render(<RegistrationForm />);
//     screen.debug();
//   })
// })


describe('Registration form', () => {
  test('Renders registration form and check for the register text', () => {
    render(<RegistrationForm />);
    //const input = screen.getByLabelText('Select your avatar')
    //console.log(input)
    //expect(input).toHaveDisplayValue('Select your avatar')
    //(screen.getByLabelText('Select your avatar')).toBeInTheDocument();
    // expect(screen.getByRole('button')).toBeInTheDocument();
    screen.debug();
  })
})
