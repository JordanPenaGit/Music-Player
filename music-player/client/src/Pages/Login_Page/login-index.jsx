/* eslint-disable */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useNavigate } from 'react-router-dom';

function MyModal() {
  const [isOpen, setIsOpen] = useState(false); // Initially, do not have the pop-up on

  // Sign up states
  const [createdUsername, setCreatedUsername] = useState('');
  const [createdPassword, setCreatedPassword] = useState('');
  const [validCreatedUser, setValidCreatedUser] = useState(true);
  const [validCreatedPassword, setValidCreatedPassword] = useState(true);

  // Error states
  const [userValidationError, setUserValidationError] = useState('');

  const handleCreatedUsername = (event) => {
    setCreatedUsername(event.target.value);
  };

  const handleCreatedPassword = (event) => {
    setCreatedPassword(event.target.value);
  };

  function closeModal() {
    setIsOpen(false);
    setValidCreatedUser(true);
    setValidCreatedPassword(true);
  }

  function openModal() {
    setIsOpen(true);
  }

  // FIXME: STYLE LATER IF YOU HAVE TIME
  const validUsername = async (value) => {
    if (value.length < 3 || value.length > 30) {
      setUserValidationError('Username must be within 3-30 characters.');
      setValidCreatedUser(false);
      return false;
    }

    // Check whether the username already exists in the database.
    const response = await fetch(`http://localhost:3001/users/username/${createdUsername}`);
    const temp = await response.json();
    const usernameExists = temp.userExists;

    if (usernameExists) {
      setUserValidationError('This username already exists');
      setValidCreatedUser(false);
      return false;
    }

    setValidCreatedUser(true);
    return true;
  };

  // FIXME: STYLE LATER IF YOU HAVE TIME
  const validPassword = (value) => {
    if (value.length < 8 || value.length > 64) {
      setValidCreatedPassword(false);
      return false;
    }

    setValidCreatedPassword(true);
    return true;
  };

  // async function because of the fetch.
  async function userSignup() {
    // Checks if username is between 3-30 characters and if it is a duplicate.
    const validUser = await validUsername(createdUsername);

    // Passwords between 8-64 characters.
    const validPass = validPassword(createdPassword);

    // If username and password are both valid, then post the new user to database.
    if (validUser && validPass) {
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ Username: createdUsername, Password: createdPassword }),
      };

      // await is not needed here since we do not rely on this data right after the call.
      fetch('http://localhost:3001/users', requestOptions);

      closeModal();
    }
  }

  return (
    <>
      <div className="px-4">
        <button
          type="button"
          onClick={openModal}
          className="px-4 py-2 text-sm font-medium text-white bg-black rounded-md hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
        >
          Sign up
        </button>
      </div>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="fixed inset-0 z-10 overflow-y-auto" onClose={closeModal}>
          <div className="min-h-screen px-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0" />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span className="inline-block h-screen align-middle" aria-hidden="true">
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900 px-2">
                  Registration
                </Dialog.Title>
                <div className="mt-2">
                  <br />
                  <label className="text-sm text-gray-700 px-2"> Username </label>
                  <input
                    className="text-sm px-1"
                    type="text"
                    name="username"
                    placeholder="Enter username"
                    onChange={handleCreatedUsername}
                  />
                  {!validCreatedUser && (
                    <div className="alert alert-danger px-2 py-2" role="alert">
                      {userValidationError}
                    </div>
                  )}
                  <br />
                  <br />

                  <label className="text-sm text-gray-700 px-2"> Password </label>
                  <input
                    className="text-sm px-1"
                    type="password"
                    name="password"
                    placeholder="Enter password"
                    onChange={handleCreatedPassword}
                  />
                  {!validCreatedPassword && (
                    <div className="alert alert-danger px-2 py-2" role="alert">
                      Password must be within 8-64 characters.
                    </div>
                  )}

                  <br />
                  <br />
                </div>

                <div className="mt-4 px-1">
                  <button
                    type="button"
                    className="inline-flex justify-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                    onClick={userSignup}
                  >
                    Sign up
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}

// When returning, make sure you have things sandwiched with one component (like one <div> tag). If you have two different
// <div> tags, it will not work. If you want to do that, make sure that the two <div> tags are within one <div> tag.
// Also, you do not need to include all the html tags here. Just include whatever is in the body.
function Login() {
  // Code for checking authentication
  // {isLoggedIn
  // ? <LogoutButton onClick={this.handleLogoutClick} />
  // : <LoginButton onClick={this.handleLoginClick} />
  // }

  const navigate = useNavigate();

  // Login states
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isWrongInput, setIsWrongInput] = useState(false);

  const handleUsername = (event) => {
    // Event is the event. Target is the actual input box. Value is the value within the input box that the user inputs.
    setUsername(event.target.value);
  };

  const handlePassword = (event) => {
    setPassword(event.target.value);
  };

  async function isValidLogin() {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ Username: username, Password: password }),
    };

    const response = await fetch('http://localhost:3001/users/username/login', requestOptions);
    const temp = await response.json();
    const { userExists, userInfo } = temp;

    if (!userExists) setIsWrongInput(true);
    else {
      setIsWrongInput(false);

      console.log('USER HAS THIS MANY SONGS');
      console.log(userInfo.PlaylistIDs.length);

      // If the user has no playlists yet, direct them to the create playlist page.
      if (userInfo.PlaylistIDs.length < 1) navigate('/createPlaylist', { state: { userInfo } });
      else navigate('/player', { state: { userInfo } });
    }
  }

  return (
    <div>
      <h1 className="text-center py-4 text-lg font-bold leading-6 text-gray-900">
        Welcome to your jam!
      </h1>
      <form className="py-4">
        <label className="px-4">Username</label>
        <input
          type="text"
          name="user"
          placeholder="Enter username"
          className="px-1"
          onChange={handleUsername}
        />

        <br />
        <br />

        <label className="px-4">Password</label>
        <input
          type="password"
          name="pass"
          placeholder="Enter password"
          className="px-1"
          onChange={handlePassword}
        />
        {isWrongInput && (
          <div className="alert alert-danger px-4 py-4" role="alert">
            Wrong username/password.
          </div>
        )}
        <br />
        <br />

        <div className="px-4">
          <button
            type="button"
            className="px-4 py-2 text-sm font-medium text-white bg-black rounded-md hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
            onClick={isValidLogin}
          >
            Login
          </button>
        </div>

        <br />
        <MyModal />
      </form>
    </div>
  );
}

export default Login;
