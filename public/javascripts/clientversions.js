var latestVersion = {
  version: 0,
  date: Date.now()
};

var dateSort = function(a, b) {
  return parseInt(b.date) - parseInt(a.date);
};

var loadClients = function() {
  $.getJSON('/clients/list', function(data) {
    $('#clients').empty();
    var sorted = data.sort(dateSort);
    $.each(sorted, function(i, client) {
      var current = moment(client.date);
      var latest = moment(Date.now());

      var monthDiff = latest.diff(current, 'months');
      var c = 'success';
      if(monthDiff > 2) {
        c = 'warning';
      }
      if(monthDiff > 6) {
        c = 'error';
      }
      
      var mainLink = client.name;
      if(parseInt(client.version) >= 787 && client.hostname) {
        mainLink = '<a href="/client/usage/' + client.name + '">' + client.name + '</a>';
      }

      var licencebreachid = 'licencebreach' + i;
      $('#clients').append('<tr class="' + c + '"><td>' + mainLink + '</td><td class="version">' + client.version + '</td><td>' + moment(client.date).from(latest) + '</td><td id="' + licencebreachid + '">Unknown</td><td><a href="/client/' + client.name + '">configure</a></td></tr>');

      // $.getJSON('/client/statistics/' + client.name, function(data) {
      //   var breachedText = "Unknown";
      //   if(data) {
      //       breachedText = data.breached ? "Breached" : "Ok";
      //   }
      //    $("#" + licencebreachid).html(breachedText);
      // });
    });
  });
}

var loadLatestVersion = function() {
  $.getJSON('/versions/latest', function(data) {
    latestVersion = data;
    $('#latestversion').html("Version " + latestVersion.version +  " was released " + moment(latestVersion.date).fromNow());
    loadClients();
  });
};

$(document).ready(function()
{
  loadLatestVersion();
  setInterval(loadLatestVersion, 1 * 60 * 60 * 1000); //hourly
  $("#addclient").click(function() {  
    var name = $("#addclientname").val();
    if(latestVersion.version != 0 && name != "") {
      $.post('/client', { name : name, version:latestVersion.version  }, function() {
        loadClients();
        $("#addclientname").val('');
      });
    }
    return false;
  });  
});
