/* eslint-disable */
const formElement = document.querySelector('.form--login');
const logOutBtn = document.querySelector('.nav__el--logout');
const userData = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-settings');

const bookBtn = document.getElementById('bookTour');

if (formElement) {
  formElement.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    // let myForm = document.getElementById('form');
    // let formData = new FormData(myForm);
    // console.log(formData);
    login(email, password);
  });
}

const login = async (email, password, formData) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/login',
      data: {
        email: email,
        password: password,
      },
      // data: formData,
      withCredentials: true,
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Logged in successfully');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    showAlert('error', 'Username and Password is incorrect');
    console.log(err.response.data.message);
  }
};

async function logOut() {
  console.log('logout');
  try {
    const res = await axios({
      method: 'GET',
      url: '/api/v1/users/logout',
    });
    if (res.data.status === 'success') {
      location.assign('/');
    }
  } catch (err) {
    console.log(err.response);
    showAlert('error', 'Error Logging out. Try again');
  }
}

if (logOutBtn) {
  logOutBtn.addEventListener('click', logOut);
}

const showAlert = (type, message) => {
  hideAlert();
  const markup = `<div class="alert alert--${type}">${message}</div>`;
  document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
  window.setTimeout(hideAlert, 5000);
};

const hideAlert = () => {
  const el = document.querySelector('.alert');
  if (el) {
    el.parentElement.removeChild(el);
  }
};

if (userData) {
  userData.addEventListener('submit', (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);
    console.log(form);
    updateSettings(form, 'data');
  });
}

if (userPasswordForm) {
  userPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    document.querySelector('.btn--savePassword').textContent = 'updating...';
    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    await updateSettings(
      { passwordCurrent, password, passwordConfirm },
      'password'
    );
    document.querySelector('.btn--savePassword').textContent = 'Save password';
    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
  });
}

// type is either password or data
const updateSettings = async (userInfoObj, type) => {
  try {
    const url =
      type === 'password'
        ? '/api/v1/users/updateMyPassword'
        : '/api/v1/users/updateMe';
    const res = await axios({
      method: 'PATCH',
      url: url,
      data: userInfoObj,
      withCredentials: true,
    });
    if (res.data.status === 'success') {
      console.log(res.data);
      showAlert('success', `${type} updated successfully`);
      location.reload();
    }
  } catch (err) {
    showAlert('error', 'Error while updating');
  }
};

const stripe = Stripe(
  'pk_test_51KOMKcSCJJiPCmeEWbIVaoCRqzyizHeqFt3iEzZ4iYuKwMBuzLRgWXIWYqo35GQPVAeKIQfFvPIC6jc5Vfodj83A00gsPNA3kF'
);
const bookTour = async (tourId) => {
  // get checkout session from api
  const session = await axios.get(
    `/api/v1/bookings/checkout-session/${tourId}`,
    {
      withCredentials: true,
    }
  );
  // fetch(`http://localhost:3000/api/v1/bookings/checkout-session/${tourId}`, {
  //   credentials: 'include',
  // })
  //   .then((response) => response.json())
  //   .then((data) => console.log(data));
  console.log(session);
  // create checkout form + charge credit card
};

if (bookBtn) {
  bookBtn.addEventListener('click', (e) => {
    e.target.textContent = 'Processing';
    const tourId = e.target.dataset.tourId;
    bookTour(tourId);
  });
}
