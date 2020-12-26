/**
 * Класс AccountsWidget управляет блоком
 * отображения счетов в боковой колонке
 * */
class AccountsWidget {
  /**
   * Устанавливает текущий элемент в свойство element
   * Регистрирует обработчики событий с помощью
   * AccountsWidget.registerEvents()
   * Вызывает AccountsWidget.update() для получения
   * списка счетов и последующего отображения
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * */
  constructor( element ) {
    if (!element) throw new Error('Переданный в качестве параметра элемент не существует');
    this.element = element;

    this.registerEvents();
  }

  /**
   * При нажатии на .create-account открывает окно
   * #modal-new-account для создания нового счёта
   * При нажатии на один из существующих счетов
   * (которые отображены в боковой колонке),
   * вызывает AccountsWidget.onSelectAccount()
   * */
  registerEvents() {
    this.element.addEventListener('click', (e) => {
      if (e.target.innerText == ' Новый счёт') {
        const createAccountButton = this.element.querySelector('.create-account');
        createAccountButton.addEventListener('click', () => App.getModal('createAccount').open());
      } else if (e.target.closest('.account')) {
        const account = e.target.closest('.account');
        this.onSelectAccount( account );
      }
    });
  }

  /**
   * Метод доступен только авторизованным пользователям
   * (User.current()).
   * Если пользователь авторизован, необходимо
   * получить список счетов через Account.list(). При
   * успешном ответе необходимо очистить список ранее
   * отображённых счетов через AccountsWidget.clear().
   * Отображает список полученных счетов с помощью
   * метода renderItem()
   * */
  update() {
    const currentUser = User.current();
    if (currentUser) {
      Account.list(currentUser, (data) => {
        this.clear();
        this.renderItem(data);
      });
    };
  }

  /**
   * Очищает список ранее отображённых счетов.
   * Для этого необходимо удалять все элементы .account
   * в боковой колонке
   * */
  clear() {
    const accounts = [...this.element.querySelectorAll('.account')];
    accounts.forEach(el => {
      el.remove();
    })
  }

  /**
   * Срабатывает в момент выбора счёта
   * Устанавливает текущему выбранному элементу счёта
   * класс .active. Удаляет ранее выбранному элементу
   * счёта класс .active.
   * Вызывает App.showPage( 'transactions', { account_id: id_счёта });
   * */
  onSelectAccount( element ) {
    const activeElement = this.element.querySelector('.active');
    activeElement.classList.remove('active');
    element.classList.add('active');
    App.showPage( 'transactions', { account_id: element.dataset.id });
  }

  /**
   * Возвращает HTML-код счёта для последующего
   * отображения в боковой колонке.
   * item - объект с данными о счёте
   * */
  getAccountHTML( {name, id, sum}, i ) {
    if (i === 0) {
      return `
      <li class="active account" data-id="${id}">
        <a href="#">
          <span>${name}</span> /
          <span>${sum} ₽</span>
        </a>
      </li>
    `
    } else {
      return `
      <li class="account" data-id="${id}">
        <a href="#">
          <span>${name}</span> /
          <span>${sum} ₽</span>
        </a>
      </li>
    `
    }
  }

  /**
   * Получает массив с информацией о счетах.
   * Отображает полученный с помощью метода
   * AccountsWidget.getAccountHTML HTML-код элемента
   * и добавляет его внутрь элемента виджета
   * */
  renderItem( item ) {
    this.clear();
    item.data.forEach((el, index) => {
      const accountHTML = this.getAccountHTML(el, index);
      this.element.insertAdjacentHTML('beforeend', accountHTML);
    });
  }
}
