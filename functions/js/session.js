document.onreadystatechange = function (e) {
  if (document.readyState === 'complete') {
    switch (sessionStorage.getItem('Rol')) {
      case 'Administrador':
        console.log('Check ok Ad');
        break;
      case 'User':
        console.log('Check ok Usr');
        break;
      case 'Contador':
        console.log('Check ok Cont');
        break;
      default:
        auth.signOut().then(() => {
          console.warn('logout y redirect por rol')
          if (!window.location.href.includes("/Login")) window.location.href = "./Login";
        })
        break;
    }
  }
}
window.onload = function (e) {
  document.body.className = document.body.className.replace("d-none", "");
  if (window.screen.width <= 1400) {
    document.body.className = "sidebar-mini layout-fixed sidebar-collapse";
  }
};