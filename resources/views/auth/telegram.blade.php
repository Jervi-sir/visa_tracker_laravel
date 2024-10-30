<!DOCTYPE html>
<html>
<head>
    <title>Telegram Login</title>
</head>
<body>
    <div id="telegram-login">
      {!! Socialite::driver('telegram')->getButton() !!}
      {{-- <script async src="https://telegram.org/js/telegram-widget.js?22" data-telegram-login="visa_trkr_bot" data-size="large" data-onauth="onTelegramAuth(user)" data-request-access="write"></script>
      <script type="text/javascript">
        function onTelegramAuth(user) {
          alert('Logged in as ' + user.first_name + ' ' + user.last_name + ' (' + user.id + (user.username ? ', @' + user.username : '') + ')');
        }
      </script> --}}
    </div>
</body>
</html>