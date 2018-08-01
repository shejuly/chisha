if (!localStorage.mainArr) {
  localStorage.mainArr = '[]';
}
var mainArr = JSON.parse(localStorage.mainArr);
// 第二页当前选中的id。
var page2CurrentItemId;
var $listUl = $('.siteList');
var $listUl2 = $('.listPlace');
var $switchBar = $('.switcher');
var $page1 = $('.page1');
var $page2 = $('.page2');
var $list2 = $page2.find('.leftBar');

var getObjById = function (id) {
  return mainArr.find(function(e) {
    return e.idName === id
  });
};
var deleteById = function (id) {
  var obj = getObjById(id);
  mainArr.splice($.inArray(obj, mainArr), 1);
};
var getLiById = function (id, $ul) {
  return $ul.find('.siteItem[data-id=' + id + ']');
};
// 获取随机数
function randomNum(minNum,maxNum){
  switch(arguments.length){
    case 1:
      return parseInt(Math.random()*minNum+1,10);
      break;
    case 2:
      return parseInt(Math.random()*(maxNum-minNum+1)+minNum,10);
      break;
    default:
      return 0;
      break;
  }
}
var clearPswText = function () {
  $('.pswText_short').text('*******');
  $('.pswText_long').text('*******');
  $('.pswText_tooLong').text('*******');
  $('.pswText_num').text('*******');
};
function ListView () {
  return {
    init: function () {
      this.$el2 = $listUl2;
      this.renderList();
      this.setEvent();
    },
    setEvent: function () {
      // 点击按钮开始roll
      //  .mainBtn
      $('.mainBtn').on('click', function() {
        var rNum = randomNum(0, mainArr.length - 1);
        var text = mainArr[rNum].foodName;
        $('.showFootPlace').text(text);
      });
    },
    setListEvent: function () {
      var self = this;
      // 第二页，点击某个列表项，左侧被填入。
      this.$el2.find('li.siteItem').on('click', function (e) {
        var idName = $(e.currentTarget).find('.content span.idName').text();
        $list2.find('.idName').val(idName);
        self.$el2.find('li.siteItem').removeClass('active');
        $(e.currentTarget).addClass('active');
        page2CurrentItemId = idName;
      });
    },
    renderList: function () {
      var lis2 = '';
      mainArr.forEach(function (e) {
        lis2 += '<li class="siteItem" data-id="' + e.idName + '"><span class="content"><span class="idName">' + e.idName + '</span><span class="foodName">' + e.foodName + '</span></span></li>';
      });
      this.$el2.html(lis2);
      this.setListEvent();
    }
  }
}
var listView = new ListView();
listView.init();
var selectOneItem = function (type) {
  var selectFirst = function ($ul) {
    if ($ul.find('li.siteItem') && $ul.find('li.siteItem').length) {
      $ul.find('li.siteItem').eq(0).click();
    }
  };
  var selectLast = function ($ul) {
    if ($ul.find('li.siteItem') && $ul.find('li.siteItem').length) {
      $ul.find('li.siteItem').eq($ul.find('li.siteItem').length - 1).click();
    }
  };
  var selectCurrent = function ($ul) {
    var li = getLiById(page2CurrentItemId, $ul);
    if (li && li.length) {
      li.click();
    }
  };
  switch (type) {
    case 'first':
      selectFirst($listUl);
      selectFirst($listUl2);
      break;
    case 'current':
      selectCurrent($listUl);
      selectCurrent($listUl2);
      break;
    case 'last':
      selectLast($listUl);
      selectLast($listUl2);
      break;
    default:
      break;
  }
};
var fresh = function (type) {
  localStorage.mainArr = JSON.stringify(mainArr);
  listView.renderList();
  if (type === 'add') {
    selectOneItem('last');
  } else if (type === 'update') {
    selectOneItem('current');
  } else if (type === 'delete') {
    selectOneItem('first');
  }
};
$('.addOneBtn').on('click', function () {
  var json = $('.page2 .leftBar .json').val();
  if (json){
    mainArr = JSON.parse(json);
    return;
  }
  var obj = {
    idName: $('.page2 .leftBar .idName').val(),
    foodName: $('.page2 .leftBar .foodName').val()
  };
  var thatObj = getObjById(obj.idName);
  var type = '';
  if (thatObj) {
    // 删除
    if (!obj.foodName) {
      deleteById(obj.idName);
      type = 'delete';
    } else {
      // 修改
      thatObj.foodName = obj.foodName;
      type = 'update';
    }
  } else {
    // 添加失败
    if (!obj.idName) {
      alert('需要食品名称');
      return;
    }
    // 添加
    mainArr[mainArr.length] = obj;
    type = 'add';
  }
  fresh(type);
});
$switchBar.find('.switchItem').on('click', function (e) {
  var target = $(e.currentTarget);
  if (!target.hasClass('active')) {
    target.siblings().removeClass('active');
    target.addClass('active');
    if (target.index()) {
      $page1.slideUp(250, function () {
        $page2.slideDown(250).css('display', 'flex');
      });
    } else {
      $page2.slideUp(250, function () {
        $page1.slideDown(250).css('display', 'flex');
      });
    }
  }
});