const Notification = ({ notification }) => {
  console.log('what is notification', notification);
  console.log('type of notification', typeof(notification));
  return (
    <div>
      {notification}
    </div>
  )
}


export default Notification
