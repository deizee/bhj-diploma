/**
 * Класс Entity - базовый для взаимодействия с сервером.
 * Имеет свойство URL, равно пустой строке.
 * */
class Entity {
  
  static URL = '';

  /**
   * Запрашивает с сервера список данных.
   * Это могут быть счета или доходы/расходы
   * (в зависимости от того, что наследуется от Entity)
   * */
  static list( data, callback = f => f ) {
    return createRequest( { 
      method: 'GET',
      url: this.URL,
      data, 
      callback: (response) => {
        if (!response.success) return;
        callback(response);
      },
    } );
  }

  /**
   * Создаёт счёт или доход/расход с помощью запроса
   * на сервер. (в зависимости от того,
   * что наследуется от Entity)
   * */
  static create(data, callback = f => f) {
    const modifiedData = {...data, _method: 'PUT'};
    return createRequest({
      method: 'POST',
      url: this.URL,
      data: modifiedData,
      callback,
    });
  }

  /**
   * Получает информацию о счёте или доходе/расходе
   * (в зависимости от того, что наследуется от Entity)
   * */
  static get( id = '', data, callback = f => f ) {
    return createRequest( { 
      method: 'GET',
      url: `${this.URL}/${id}`,
      data, 
      callback,
    } );
  }

  /**
   * Удаляет информацию о счёте или доходе/расходе
   * (в зависимости от того, что наследуется от Entity)
   * */
  static remove( id = '', data, callback = f => f ) {
    const modifiedData = { ...data, _method: 'DELETE', id };
    return createRequest({
      method: 'POST',
      url: this.URL,
      data: modifiedData,
      callback,
    });
  }
}

