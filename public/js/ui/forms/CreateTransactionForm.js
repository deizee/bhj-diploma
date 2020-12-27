/**
 * Класс CreateTransactionForm управляет формой
 * создания новой транзакции
 * Наследуется от AsyncForm
 * */
class CreateTransactionForm extends AsyncForm {
  /**
   * Вызывает родительский конструктор и
   * метод renderAccountsList
   * */
  constructor( element ) {
    super(element);
    this.renderAccountsList();
  }

  /**
   * Получает список счетов с помощью Account.list
   * Обновляет в форме всплывающего окна выпадающий список
   * */
  renderAccountsList() {
    Account.list(User.current(), (data) => {
      const select = this.element.querySelector('.accounts-select');
      select.innerHTML = '';
      const optionsHTML = data.map(el => `<option value="${el.id}">${el.name}</option>`).join(' ');
      select.insertAdjacentHTML('afterbegin', optionsHTML);
    });
  }

  /**
   * Создаёт новую транзакцию (доход или расход)
   * с помощью Transaction.create. По успешному результату
   * вызывает App.update(), сбрасывает форму и закрывает окно,
   * в котором находится форма
   * */
  onSubmit( options ) {
    const selectValue = this.element.querySelector('select').value;
    Transaction.create({...options.data, account_id: selectValue}, () => {
      this.element.reset();
      App.getModal(this.element.closest('.modal').dataset.modalId).close();
      App.update();
    })
  }
}
