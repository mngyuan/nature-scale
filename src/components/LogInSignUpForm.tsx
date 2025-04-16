'use client';

import Script from 'next/script';

export default function LogInSignUpForm() {
  function handleCredentialResponse(
    response: google.accounts.id.CredentialResponse,
  ) {
    console.log('Encoded JWT ID token: ' + response.credential);
  }

  return (
    <>
      <Script
        src="https://accounts.google.com/gsi/client"
        async
        onLoad={() => {
          google.accounts.id.initialize({
            client_id:
              '1061293555749-u783gegah306hcsbprljmccdtfp93pnv.apps.googleusercontent.com',
            callback: handleCredentialResponse,
          });
          const buttonDiv = document.getElementById('buttonDiv')!;
          google.accounts.id.renderButton(
            buttonDiv,
            {theme: 'filled_black', size: 'large', type: 'standard'}, // customization attributes
          );
          google.accounts.id.prompt(); // also display the One Tap dialog
        }}
      ></Script>
      <h2 className="p-8 text-3xl">Log In</h2>
      <div id="buttonDiv" className="p-8 w-[248px]"></div>
    </>
  );
}
