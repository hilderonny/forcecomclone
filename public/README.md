# TODO
- Implement client side app with functions for creating cardstacks and cards ( utils.createCardStack(targetTRoAttachTo, ...), utils.createCard(cardStackToAttachTo, ...) )
- Attach resize handlers to cards in creation functions like in https://jsfiddle.net/ronnyhildebrandt/2rez90co/
- Update CSS documentation

# CSS Styles and their meanings

## *

Defines attributes values for all elements on the page. Used for setting the box model, marigns and paddings for all elements.

|Attribute|Meaning|
|-|-|
|box-sizing:border-box|Defines that the definition of the size (width, height) of an element will contain padding, border and margin|
|margin:0|Disable default margin of the browser|
|padding:0|Disable default padding of the browser|

## body

The body contains the `.mainmenu`, the `.toolbar` and the `.cardstack` elements.

|Attribute|Meaning|
|-|-|
|display:flex|Enbales flexbox mode for the body to arrange the `.toolbar` and `.cardstack` below each other using up all available space|
|flex-direction:column|Forces the floxbox mecahnism to place the `.toolbar`and `.cardstack` elements below each other instead of beside of each other|
|height:100%|Defines that the page body will use all the available height of the browser window. Only functional when the height for the `html` tag is also set to 100%.|

## html

|Attribute|Meaning|
|-|-|
|height:100%|Forces the outer HTML tag to use the full available height of the browser window|

## .cardstack

The cardstack is the area below the toolbar where all cards are placed in. It uses the entire available space within the `body`. Can contain `.card` elements.

|Attribute|Meaning|
|-|-|
|align-content:center|When so many standard cards like in dashboards are shown that they cannot be placed beside each other, they must be split into multiple rows. This attribute is for putting them above and below each other and to center them all in the cardstack. Without this attribute the rows would be stretched over the full height of the cardstack.|
|align-items:center|This is for centering standard cards horizontally in the cardstack|
|display:flex|With this the div is put into flexbox mode to enable centering and wrapping cards. Without setting this attribute to "flex" all of the alignment attributes would have no effect|
|flex:1|Defines that the cardstack uses all available space within the body|
|flex-wrap:wrap|Forces to wrap cards into multiple lines instead of shrinking their width|
|justify-content:center|Responsible for centering the cards vertically|