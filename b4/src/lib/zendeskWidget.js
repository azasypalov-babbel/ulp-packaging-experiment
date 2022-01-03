import store from "../store";
import { setIsOpen } from "../dux/zendeskWidget/actions";

// eslint-disable-next-line max-len
const widgetCode = `window.zEmbed||function(e,t){var n,o,d,i,s,a=[],r=document.createElement("iframe");window.zEmbed=function(){a.push(arguments)},window.zE=window.zE||window.zEmbed,r.src="javascript:false",r.title="",r.role="presentation",(r.frameElement||r).style.cssText="display: none",d=document.getElementsByTagName("script"),d=d[d.length-1],d.parentNode.insertBefore(r,d),i=r.contentWindow,s=i.document;try{o=s}catch(e){n=document.domain,r.src='javascript:var d=document.open();d.domain="'+n+'";void(0);',o=s}o.open()._l=function(){var e=this.createElement("script");n&&(this.domain=n),e.id="js-iframe-async",e.src="https://assets.zendesk.com/embeddable_framework/main.js",this.t=+new Date,this.zendeskHost="babbel.zendesk.com",this.zEQueue=a,this.body.appendChild(e)},o.write('<body onload="document._l();">'),o.close()}();`;

const ZENDESK_LOCALES = {
  de: 'de',
  // eslint-disable-next-line camelcase
  en_GB: 'en-GB',
  en: 'en-US',
  fr: 'fr',
  it: 'it',
  pt: 'pt-BR',
  pl: 'pl',
  es: 'es',
  sv: 'sv'
};

const ZENDESK_CSS = 'div[role="presentation"]';
const ZENDESK_IFRAME_CSS = 'div[role="presentation"] iframe';

let isZendeskWidgetOpen = false;
let isZendeskWidgetLoaded = false;

const loadWidget = () => {
  let style = document.createElement('style');
  style.innerHTML = `${ZENDESK_CSS} { visibility: hidden; }`;
  style.setAttribute('data-selector', 'zendesk-style');
  document.head.appendChild(style);

  return new Function(widgetCode)();
};

const hideWidget = () => {
  // hide everything zendesk aka [role='presentation']
  document.querySelectorAll(ZENDESK_CSS).forEach((element) => { element.style.visibility = 'hidden'; });
};

const showWidget = () => {
  // show everything zendesk aka [role='presentation']
  document.querySelectorAll(ZENDESK_CSS).forEach((element) => { element.style.visibility = 'visible'; });
}

const toggle = () => {
  if (!isZendeskWidgetLoaded) return
  if (isZendeskWidgetOpen) {
    window.zE('messenger', 'close');
  } else {
    window.zE('messenger', 'open');
  }
}

const observeZendeskMessagingWindow = () => {
  // define observed element and observer config
  const iframeBody = document.querySelector(ZENDESK_IFRAME_CSS).contentWindow.document.body;
  const config = { childList: true, subtree: true };

  const callback = () => {
    const target = iframeBody.querySelector('div')
    if (target.childElementCount > 0) {
      if (!isZendeskWidgetOpen) {
        showWidget();
        store.dispatch(setIsOpen(true));
      }
      isZendeskWidgetOpen = true
    } else if (target.childElementCount === 0) {
      if (isZendeskWidgetOpen) {
        hideWidget()
        store.dispatch(setIsOpen(false));
      }
      isZendeskWidgetOpen = false
    }
  };

  const observer = new MutationObserver(callback);
  observer.observe(iframeBody, config);
}

const init = ({ locale }) => {
  loadWidget();
  window.zE('messenger:set', 'locale', ZENDESK_LOCALES[locale] || locale);
  window.zE('messenger', 'close');

  const callback = function (mutationsList, observer) {
    const [mutation] = mutationsList
    if (mutation.target.querySelectorAll(ZENDESK_IFRAME_CSS).length) {
      observer.disconnect();
      isZendeskWidgetLoaded = true;
      /* The problem is that we might have caught the initial about:blank's
       * document's body of the iframe.
       * The actual content takes some time to load in Firefox */
      setTimeout(observeZendeskMessagingWindow, 500);
    }
  }

  const observer = new MutationObserver(callback)
  observer.observe(document.body, { childList: true })
};

export default {
  init,
  toggle
};
