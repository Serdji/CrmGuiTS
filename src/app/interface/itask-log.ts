export interface ITaskLog {
  'totalRows': number;
  'result': {
    'taskLogId': number;
    'taskId': number;
    'customerId': number;
    'bookingId': number;
    'ticketId': number;
    'coupon': number;
  }[];
  'filter': {
    'customerId': number;
    'taskId': number;
  };
  'pagingInfo': {
    'from': number;
    'count': number;
    'orderField': number;
  };
}
