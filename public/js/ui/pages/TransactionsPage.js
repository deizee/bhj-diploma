/**
 * Класс TransactionsPage управляет
 * страницей отображения доходов и
 * расходов конкретного счёта
 * */
class TransactionsPage {
  /**
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * Сохраняет переданный элемент и регистрирует события
   * через registerEvents()
   * */
  constructor( element ) {
    if (!element) throw new Error('Переданный в качестве параметра элемент не существует');
    this.element = element;
    this.lastOptions = {};

    this.registerEvents();
  }

  /**
   * Вызывает метод render для отрисовки страницы
   * */
  update() {
    if (Object.keys(this.lastOptions).length != 0) {
      this.render(this.lastOptions);
    };
  }

  /**
   * Отслеживает нажатие на кнопку удаления транзакции
   * и удаления самого счёта. Внутри обработчика пользуйтесь
   * методами TransactionsPage.removeTransaction и
   * TransactionsPage.removeAccount соответственно
   * */
  registerEvents() {
    this.element.addEventListener('click', (e) => {
      if (e.target.classList.contains('remove-account') || e.target.parentElement.classList.contains('remove-account')) {
        this.removeAccount();
      }
      
      if (e.target.classList.contains('transaction__remove') || e.target.parentElement.classList.contains('transaction__remove')) {
        let transactionId = '';
        e.target.classList.contains('transaction__remove')? transactionId = e.target.dataset.id : transactionId = e.target.parentElement.dataset.id;
        this.removeTransaction(transactionId);
      }
    })
  }

  /**
   * Удаляет счёт. Необходимо показать диаголовое окно (с помощью confirm())
   * Если пользователь согласен удалить счёт, вызовите
   * Account.remove, а также TransactionsPage.clear с
   * пустыми данными для того, чтобы очистить страницу.
   * По успешному удалению необходимо вызвать метод App.update()
   * для обновления приложения
   * */
  removeAccount() {
    if (Object.keys(this.lastOptions).length === 0) return;

    const isConfirm = confirm('Вы действительно хотите удалить счёт?');
    if (isConfirm) {
      Account.remove(this.lastOptions.account_id, {}, () => App.update());
      this.lastOptions = {};
      this.clear();
    }
  }

  /**
   * Удаляет транзакцию (доход или расход). Требует
   * подтверждеия действия (с помощью confirm()).
   * По удалению транзакции вызовите метод App.update()
   * */
  removeTransaction( id ) {
    const isConfirm = confirm('Вы действительно хотите удалить эту транзакцию?');
    if (isConfirm) {
      Transaction.remove(id, {}, () => App.update());
    }
  }

  /**
   * С помощью Account.get() получает название счёта и отображает
   * его через TransactionsPage.renderTitle.
   * Получает список Transaction.list и полученные данные передаёт
   * в TransactionsPage.renderTransactions()
   * */
  render( options ) {
    if (Object.keys(options).length === 0) {
      options = this.lastOptions;
    } else {
      this.lastOptions = options;
    };
    
    Account.get(options.account_id, {}, (name) => this.renderTitle(name));
    Transaction.list(options, (data) => this.renderTransactions(data));
  }

  /**
   * Очищает страницу. Вызывает
   * TransactionsPage.renderTransactions() с пустым массивом.
   * Устанавливает заголовок: «Название счёта»
   * */
  clear() {
    this.renderTransactions([]);
    const contentTitle = this.element.querySelector('.content-title');
    contentTitle.textContent = 'Название счёта';
    this.lastOptions = {};
  }

  /**
   * Устанавливает заголовок в элемент .content-title
   * */
  renderTitle( name ) {
    const contentTitle = this.element.querySelector('.content-title');
    contentTitle.innerText = name;
  }

  /**
   * Форматирует дату в формате 2019-03-10 03:20:41 (строка)
   * в формат «10 марта 2019 г. в 03:20»
   * */
  formatDate( date ) {
    const DMY = new Date(date).toLocaleString('ru', {day: "numeric", month: "long", year: "numeric"});
    const HM = new Date(date).toLocaleString('ru', {hour: "numeric", minute: "numeric"});
    return `${DMY} в ${HM}`;
  }

  /**
   * Формирует HTML-код транзакции (дохода или расхода).
   * item - объект с информацией о транзакции
   * */
  getTransactionHTML( {id, type, name, created_at, sum} ) {
    return `
      <div class="transaction transaction_${type.toLowerCase()} row">
        <div class="col-md-7 transaction__details">
          <div class="transaction__icon">
            <span class="fa fa-money fa-2x"></span>
          </div>
          <div class="transaction__info">
            <h4 class="transaction__title">${name}</h4>
            <!-- дата -->
            <div class="transaction__date">${this.formatDate(created_at)}</div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="transaction__summ">
            ${sum} <span class="currency">₽</span>
          </div>
        </div>
        <div class="col-md-2 transaction__controls">
          <button class="btn btn-danger transaction__remove" data-id="${id}">
            <i class="fa fa-trash"></i>  
          </button>
        </div>
      </div>
    `;
  }

  /**
   * Отрисовывает список транзакций на странице
   * используя getTransactionHTML
   * */
  renderTransactions( data ) {
    const transactionsHTML = data.map(el => this.getTransactionHTML(el)).join(' ');
    const contentElement = this.element.querySelector('.content');
    contentElement.innerHTML = '';
    contentElement.insertAdjacentHTML('afterbegin', transactionsHTML);
  }
}
