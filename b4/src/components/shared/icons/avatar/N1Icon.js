import React from 'react';
import PropTypes from 'prop-types';
import Icon from '../Icon';

const N1Icon = ({ size })=> (
  <Icon
    viewBox="0 0 48 48"
    size={size}
  >
    <circle
      cx="24"
      cy="24"
      r="24"
      fill="#99D65C"
    />
    <path
      d="M14.5137 15.1965H31.758L31.4723 20.7485C31.8659 20.9103 32.1398
        21.301 32.1314 21.7522L32.0996 23.4682C32.086 24.2054 31.754 24.8616
        31.2376 25.3086L31.0849 28.2758C31.0533 28.8899 30.8349 29.4687 30.4729
        29.9427L30.8378 43.0528H18.8994L21.1734 33.7674H20.074C18.9818 33.7674
        17.9758 33.1737 17.4478 32.2176L15.1367 28.0325C14.728 27.2924 14.5137
        26.4608 14.5137 25.6154V15.1965Z"
      fill="#AD6349"
    />
    <path
      d="M42.7478 35.517C38.8758 41.8067 31.9274 46 23.9996 46C18.3411 46
        13.1815 43.8637 9.28345 40.3537L9.3487 39.9785C9.94013 36.5779 13.7177
        34.7852 16.7261 36.4774L19.6567 38.1258C21.0341 39.8476 23.312 40.5734
        25.3717 39.7864C26.8127 39.2358 28.5873 38.4927 30.4581 37.5574C33.0545
        36.2591 36.5775 35.3315 39.1227 34.7744C40.4145 34.4917 41.7115 34.7919
        42.7478 35.517Z"
      fill="#E5F5D6"
    />
    <circle
      cx="15.5745"
      cy="22.4845"
      r="0.643679"
      fill="#140B41"
    />
    <circle
      cx="23.5337"
      cy="22.4845"
      r="0.643679"
      fill="#140B41"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M29.3158 30.325C29.3893 30.4419 29.3543 30.5962 29.2374 30.6698L24.959
        33.3638C24.2808 33.7909 23.4958 34.0174 22.6944 34.0174H21.4901C21.352
        34.0174 21.2401 33.9055 21.2401 33.7674C21.2401 33.6294 21.352 33.5174
        21.4901 33.5174H22.6944C23.4015 33.5174 24.0942 33.3175 24.6925
        32.9407L28.971 30.2467C29.0878 30.1731 29.2422 30.2082 29.3158 30.325Z"
      fill="#140B41"
    />
    <path
      d="M15.1755 16.5233C14.5122 18.513 14.5122 19.1762 14.5122 21.8292C13.285
        18.9722 13.2851 13.8703 14.5122 13.8703C15.3304 11.0133 18.5257 7.23785
        23.8435 7.23785C29.1613 7.23785 26.5606 9.45834 30.3885 10.0949C35.2972
        10.9112 34.4744 15.4009 34.1472 20.2987C34.0108 22.3394 32.7296
        26.1658 31.0933 27.7984C31.0933 27.7984 31.7772 20.3164 30.0001
        22.0001C29.591 24.449 29.6475 21.115 29.6475 21.115C29.6475 19.0742
        29.1613 18.666 27.9341 16.6253C26.5223 14.2776 25.0707 16.2172 22.6163
        17.0335C20.6528 17.6865 16.423 17.0335 15.1755 16.5233Z"
      fill="#140B41"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M19.936 23.9854C20.0668 24.0297 20.137 24.1716 20.0927 24.3023C19.8498
        25.0205 19.5238 25.5671 19.2141 25.9396L19.2125 25.9438C19.2035 25.9677
        19.1915 26.003 19.1802 26.0458C19.1571 26.1341 19.1411 26.2408 19.1531
        26.3409C19.1645 26.4364 19.1999 26.5184 19.2758 26.5832C19.3448 26.6421
        19.468 26.7045 19.6882 26.7311L19.6894 26.73C19.7449 26.6797 19.8249 26.6131
        19.9212 26.5512C20.0996 26.4365 20.4044 26.2927 20.7223 26.4134C20.8672
        26.4683 20.9812 26.5604 21.0678 26.6403C21.1073 26.6768 21.1448 26.7144
        21.1771 26.7468C21.1804 26.7501 21.1836 26.7534 21.1868 26.7566C21.2231
        26.7929 21.252 26.8214 21.2788 26.8448C21.2957 26.8596 21.3084 26.8692
        21.3175 26.8755C21.3273 26.8669 21.341 26.8531 21.3588 26.8315C21.4464
        26.7248 21.6039 26.7093 21.7106 26.797C21.8173 26.8846 21.8328 27.0421
        21.7452 27.1488C21.6383 27.279 21.4983 27.3864 21.3176 27.3849C21.1507
        27.3835 21.0248 27.2868 20.9498 27.2213C20.9084 27.1852 20.8683 27.1451
        20.833 27.1099C20.83 27.1068 20.8269 27.1037 20.8239 27.1007C20.7905
        27.0672 20.7601 27.0368 20.7285 27.0076C20.659 26.9434 20.6009 26.9021
        20.5449 26.8808C20.4609 26.849 20.3393 26.8768 20.1917 26.9717C20.125
        27.0146 20.0671 27.0624 20.0254 27.1003C20.0049 27.1189 19.9889 27.1346
        19.9785 27.1451L19.9673 27.1566L19.9654 27.1586L19.8851 27.2468L19.7659
        27.2397C19.4089 27.2187 19.1396 27.1244 18.9511 26.9635C18.7592 26.7996
        18.6795 26.591 18.6567 26.4005C18.6344 26.2147 18.6648 26.0403 18.6966
        25.9189C18.7129 25.8569 18.7305 25.8052 18.7443 25.7684C18.7512 25.7499
        18.7572 25.7349 18.7618 25.724L18.8073 25.6464C19.0808 25.3251 19.3882
        24.8246 19.6191 24.1421C19.6633 24.0113 19.8052 23.9412 19.936 23.9854Z"
      fill="#140B41"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M13.0919 21.5027C13.0919 20.6743 13.7634 20.0027 14.5919
        20.0027H17.2346C18.063 20.0027 18.7346 20.6743 18.7346
        21.5027V21.9924H21.0508V21.5027C21.0508 20.6743 21.7224
        20.0027 22.5508 20.0027H25.1936C26.022 20.0027 26.6936
        20.6743 26.6936 21.5027V24.1454C26.6936 24.9738 26.022
        25.6454 25.1936 25.6454H22.5509C21.7224 25.6454 21.0508
        24.9738 21.0508 24.1454V22.9924H18.7346V24.1454C18.7346
        24.9738 18.063 25.6454 17.2346 25.6454H14.5919C13.7634
        25.6454 13.0919 24.9738 13.0919 24.1454V21.5027ZM14.5919
        21.0027C14.3157 21.0027 14.0919 21.2265 14.0919 21.5027V24.1454C14.0919
        24.4215 14.3157 24.6454 14.5919 24.6454H17.2346C17.5107
        24.6454 17.7346 24.4215 17.7346 24.1454V21.5027C17.7346
        21.2265 17.5107 21.0027 17.2346 21.0027H14.5919ZM22.5508
        21.0027C22.2747 21.0027 22.0508 21.2265 22.0508 21.5027V24.1454C22.0508
        24.4215 22.2747 24.6454 22.5509 24.6454H25.1936C25.4697 24.6454
        25.6936 24.4215 25.6936 24.1454V21.5027C25.6936 21.2265 25.4697
        21.0027 25.1936 21.0027H22.5508Z"
      fill="#FF7433"
    />
    <path
      d="M23.6189 29.3252L23.6198 29.3237C23.6556 29.2641 23.6506 29.1886
        23.6074 29.1343C23.5641 29.0799 23.4917 29.058 23.4256 29.0794L22.6275
        29.3376C22.4039 29.331 22.114 29.2888 21.7417 29.1824C20.9515 28.9566
        20.4207 29.1815 20.091 29.4812C19.9302 29.6274 19.8215 29.7871 19.7531
        29.9096C19.7188 29.9711 19.6941 30.0239 19.6778 30.0621C19.6696 30.0813
        19.6635 30.0968 19.6593 30.108L19.6544 30.1215L19.6529 30.1257L19.6521
        30.1281C19.6334 30.1843 19.6459 30.2462 19.685 30.2907C19.7241 30.3353
        19.7839 30.3557 19.842 30.3444L21.7277 29.9777C21.7343 29.9764 21.7408
        29.9747 21.7472 29.9727L22.6773 29.6718C22.6918 29.6719 22.7061 29.6718
        22.7202 29.6717L22.7181 29.6772C22.5471 30.1531 22.2498 30.435 21.8538
        30.581C21.4452 30.7316 20.9111 30.7444 20.2696 30.6284C20.1338 30.6038
        20.0037 30.694 19.9791 30.8299C19.9546 30.9658 20.0448 31.0958 20.1806
        31.1204C20.8657 31.2443 21.5005 31.2441 22.0268 31.0501C22.5657 30.8514
        22.9692 30.457 23.1887 29.8463C23.2177 29.7657 23.2026 29.6799 23.156
        29.6152C23.1656 29.6126 23.175 29.6099 23.1843 29.6071C23.3358 29.5616
        23.4404 29.4991 23.51 29.4426C23.5445 29.4145 23.5698 29.3884 23.5876
        29.3675C23.5965 29.357 23.6035 29.3479 23.6087 29.3404L23.6155 29.3306L23.6179
        29.3268L23.6189 29.3252Z"
      fill="#140B41"
    />
    <path
      d="M29.9606 21.6528L29.6367 22.3707C29.5252 22.6179 29.4651 22.8851
        29.4601 23.1562L29.4023 26.2735C30.7869 26.3095 31.9358 25.2107
        31.9614 23.8259L31.9932 22.1098C32.0041 21.5226 31.5369 21.0377
        30.9496 21.0269C30.5244 21.019 30.1354 21.2652 29.9606 21.6528Z"
      fill="#AD6349"
    />
  </Icon>
);

N1Icon.propTypes = {
  size: PropTypes.string
};

export default N1Icon;
