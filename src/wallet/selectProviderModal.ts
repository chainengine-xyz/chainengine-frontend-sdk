import Deferred from '../utils/deferred';
import {
  AvailableAuthProviders,
  CustodianProviders,
  NoncustodialProviders,
} from './types';

import googleImage from '../images/app.google.svg';
import metamaskImage from '../images/app.metamask.png';
import bgImage from '../images/BG.svg';

let googleApisLink: HTMLLinkElement;
let googleGstaticLink: HTMLLinkElement;
let fontLink: HTMLLinkElement;
let styles: HTMLStyleElement;

const attachSyles = () => {
  googleApisLink = document.createElement('link');
  googleApisLink.href = 'https://fonts.googleapis.com';
  googleApisLink.rel = 'preconnect';
  document.head.append(googleApisLink);

  googleGstaticLink = document.createElement('link');
  googleGstaticLink.href = 'https://fonts.googleapis.com';
  googleGstaticLink.rel = 'preconnect';
  document.head.append(googleGstaticLink);

  fontLink = document.createElement('link');
  fontLink.rel = 'stylesheet';
  fontLink.href =
    'https://fonts.googleapis.com/css2?family=Poppins:wght@200;300;400;500;600&display=swap';
  document.head.append(fontLink);

  styles = document.createElement('style');
  styles.innerText = `
    .chainengine {
      font-family: Poppins;
    }
  
    button.chainengine {
      font-weight: 600;
      width: 100%;
      font-size: 14px;
      border: 1px solid rgba(16, 156, 241, 0.5);
      border-radius: 10px;
      color: rgb(16, 156, 241);
      background-color: white;
      transition: background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, 
                  box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, 
                  border-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, 
                  color 250ms cubic-bezier(0.4, 0, 0.2, 1) 
    }

    button.chainengine:hover {
      cursor: pointer;

      text-decoration: none;
      background-color: rgba(16, 156, 241, 0.04);
      border: 1px solid rgb(16, 156, 241);
    }

    button.chainengine > div {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 14px;
    }

    button.chainengine > div > img {
      width: 28px;
      height: 28px
    }
  `;
  document.head.append(styles);
};

const dettachStyle = () => {
  if (googleApisLink) googleApisLink.remove();
  if (googleGstaticLink) googleGstaticLink.remove();
  if (fontLink) googleGstaticLink.remove();
  if (styles) styles.remove();
};

export const renderSelectProviderModal =
  (): Promise<AvailableAuthProviders> => {
    const deferredPromise = new Deferred<AvailableAuthProviders>();

    attachSyles();

    const modal = document.createElement('div');
    modal.style.position = 'fixed';
    modal.style.display = 'flex';
    modal.style.justifyContent = 'center';
    modal.style.alignItems = 'center';
    modal.style.inset = '0px';
    modal.style.backgroundColor = '#00000021';

    const modalContentWrapper = document.createElement('div');
    modalContentWrapper.style.display = 'flex';
    modalContentWrapper.style.flexDirection = 'column';
    modalContentWrapper.style.backgroundColor = 'white';
    // modalContentWrapper.style.backgroundImage = `URL(../images/BG.svg`;
    modalContentWrapper.style.backgroundSize = 'cover';
    modalContentWrapper.style.width = '350px';
    modalContentWrapper.style.height = '500px';
    modalContentWrapper.style.padding = '16px';
    modalContentWrapper.style.borderRadius = '21px';
    modalContentWrapper.style.position = 'relative';

    modalContentWrapper.style.boxShadow =
      'rgb(50 50 93 / 25%) 0px 13px 27px -5px, rgb(0 0 0 / 30%) 0px 8px 16px -8px';
    const divToBeRemoved = document.createElement('div');

    divToBeRemoved.style.position = 'absolute';
    divToBeRemoved.style.top = '0';
    divToBeRemoved.style.bottom = '0';
    divToBeRemoved.style.left = '0';
    divToBeRemoved.style.right = '0';
    bgImage.style.width = '100%';
    bgImage.style.height = '100%';
    bgImage.style.objectFit = 'cover';

    divToBeRemoved.append(bgImage);
    modalContentWrapper.append(divToBeRemoved);

    modal.append(modalContentWrapper);

    const modalContent = document.createElement('div');
    modalContent.style.display = 'flex';
    modalContent.style.flexDirection = 'column';
    modalContent.style.flex = '1';

    modalContent.style.gap = '8px';
    modalContent.style.justifyContent = 'center';
    modalContent.style.alignItems = 'center';
    modalContent.style.zIndex = '1';
    modalContentWrapper.append(modalContent);

    const metamaskButton = document.createElement('button');
    metamaskButton.classList.add('chainengine');
    const metamaskButtonContent = document.createElement('div');
    metamaskButton.append(metamaskButtonContent);

    metamaskButtonContent.append(metamaskImage);

    const metamaskText = document.createElement('span');
    metamaskText.innerText = 'Sign In with Metamask';
    metamaskButtonContent.append(metamaskText);
    metamaskButton.onclick = () => {
      resolve(CustodianProviders.METAMASK);
    };
    modalContent.append(metamaskButton);

    const googleButton = document.createElement('button');
    googleButton.classList.add('chainengine');
    const googleButtonContent = document.createElement('div');
    googleButton.append(googleButtonContent);

    googleButtonContent.append(googleImage);

    const googleText = document.createElement('span');
    googleText.innerText = 'Sign In with Google';
    googleButtonContent.append(googleText);
    googleButton.onclick = () => {
      resolve(NoncustodialProviders.GOOGLE);
    };
    modalContent.append(googleButton);

    const cancel = document.createElement('button');
    cancel.classList.add('chainengine');
    cancel.innerText = 'Cancel';
    cancel.onclick = () => {
      reject();
    };
    modalContent.append(cancel);

    const poweredByWrapper = document.createElement('div');
    poweredByWrapper.classList.add('chainengine');
    poweredByWrapper.style.display = 'flex';
    poweredByWrapper.style.alignItems = 'center';
    poweredByWrapper.style.flexDirection = 'column';
    poweredByWrapper.style.lineHeight = '1';

    const poweredByDiv = document.createElement('div');
    poweredByDiv.style.fontSize = '8px';
    poweredByDiv.innerText = 'powered by';

    poweredByWrapper.append(poweredByDiv);

    const chainEngineLogoWrapper = document.createElement('span');
    const chainEngineLogoChain = document.createElement('span');
    chainEngineLogoChain.innerText = 'chain';
    chainEngineLogoChain.style.color = 'rgb(16, 156, 241)';
    chainEngineLogoChain.style.fontWeight = '600';
    chainEngineLogoWrapper.append(chainEngineLogoChain);

    const chainEngineLogoEngine = document.createElement('span');
    chainEngineLogoEngine.innerText = 'engine';
    chainEngineLogoWrapper.append(chainEngineLogoEngine);
    poweredByWrapper.append(chainEngineLogoWrapper);

    modalContentWrapper.append(poweredByWrapper);
    document.body.append(modal);

    const resolve = (selectedProvider: AvailableAuthProviders) => {
      modal.remove();
      dettachStyle();
      deferredPromise.resolve(selectedProvider);
    };

    const reject = () => {
      modal.remove();
      dettachStyle();
      throw new Error('TODO: Modal closed or some error occurred');
    };

    return deferredPromise.promise;
  };
