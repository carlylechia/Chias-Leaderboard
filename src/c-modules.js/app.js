import FireFlyCity from './game.js';

class Application {
  constructor() {
    this.inputs = document.querySelectorAll('.userdetails');
    this.success_message = document.querySelector('.success-message');
    this.form = document.getElementById('c-form');
    this.tableList = document.getElementById('scores');
    this.refreshBtn = document.querySelector('.refresh');
    this.resetBtn = document.querySelector('.reset');
    this.loader = document.getElementById('Loader');
    this.localStorageStringInstance = 'app_config';

    this.fireFly = new FireFlyCity();
    if (this.onLoad() != null) {
      this.fireFly.id = this.onLoad();
      this.refreshList();
    } else {
      this.createNewToken();
    }
  }

  initApp = () => {
    this.form.addEventListener('submit', (event) => {
      const refInstance = event.currentTarget.ref;
      refInstance.addUserScore();
      event.preventDefault();
    });
    this.form.ref = this;

    this.refreshBtn.addEventListener('click', (event) => {
      event.currentTarget.ref.refreshList();
    });
    this.refreshBtn.ref = this;

    this.resetBtn.addEventListener('click', (event) => {
      event.currentTarget.ref.createNewToken();
    });
    this.resetBtn.ref = this;
  }

  createNewToken = () => {
    this.showGif();
    const res = this.fireFly.getID('Seed');
    res.then((data) => {
      const stringResult = data.result;
      this.fireFly.id = stringResult.substring(13, 34);
      this.onSave(this.fireFly.id);
      this.hideGif();
      this.refreshList();
    })
      .catch((error) => {
        throw error;
      });
  }

  addUserScore = () => {
    this.showGif();
    const res = this.fireFly.insertData(this.inputs[0].value, this.inputs[1].value);
    res.then((data) => {
      this.success_message.innerHTML = data.result;

      this.inputs[0].value = '';
      this.inputs[1].value = '';

      this.hideGif();
      this.refreshList();

      const ref = this;
      setTimeout(() => { ref.success_message.innerHTML = ''; }, 1800, ref);
    })
      .catch((error) => {
        throw error;
      });
  }

  refreshList = () => {
    this.showGif();
    const res = this.fireFly.fetchData();
    res.then((data) => {
      let domContent = '';
      const users = data.result;
      users.sort((a, b) => b.score - a.score);
      users.forEach((user) => {
        domContent = `${domContent}<tr class="animate">
        <td>${user.user}</td>
        <td class="text-primary">${user.score}</td>
        </tr>`;
      });
      this.hideGif();
      this.tableList.innerHTML = domContent;
    })
      .catch((error) => {
        throw error;
      });
  }

  showGif = () => {
    this.loader.classList.remove('hide');
    this.loader.classList.add('show');
  }

  hideGif = () => {
    this.loader.classList.remove('show');
    this.loader.classList.add('hide');
  }

  onSave = (token) => {
    localStorage.setItem(this.localStorageStringInstance, token);
  }

  onLoad = () => localStorage.getItem(this.localStorageStringInstance);
}

export default Application;