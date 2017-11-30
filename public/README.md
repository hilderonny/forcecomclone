# TODO

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
|display:flex|With this the div is put into flexbox mode to enable centering and wrapping cards. Without setting this attribute to "flex" all of the alignment attributes would have no effect|
|flex:1|Defines that the cardstack uses all available space within the body|

## .cardstack > .card

TODO

## .cardstack.default

In the `DEFAULT` mode the cardstack behaves like a dashboard where the cards are small in size, just enough to show their content. The cards are centered on the screen beside each other with a little spaces between them.

|Attribute|Meaning|
|-|-|
|align-content:center|When so many standard cards like in dashboards are shown that they cannot be placed beside each other, they must be split into multiple rows. This attribute is for putting them above and below each other and to center them all in the cardstack. Without this attribute the rows would be stretched over the full height of the cardstack.|
|align-items:center|This is for centering standard cards horizontally in the cardstack|
|flex-wrap:wrap|Forces to wrap cards into multiple lines instead of shrinking their width|
|justify-content:center|Responsible for centering the cards vertically|

## .cardstack.default > .card

|Attribute|Meaning|
|-|-|
|height:100px|Predefined height of the card to look good on dashboards|
|margin:4px|So much space is between the dashboard cards|
|width:100px|Predefined width of the card to look good on dashboards|

## .cardstack.listdetail

In the `LISTDETAIL` mode the cards are as high as the cardstack and are arranged horizontally. All cards have a fixed width except the last one which uses all available space.

This mode is used for showing a list of objects in one card and the details of a selected object in a second card.

Between the cards are sliders with which one can resize the cards horizontally on demand.

When you have more than two cards, all except the last one have fixed widths and are resizeable horizontally. When there are more cards than available space, a horizontal scrollbar is shown at the bottom where you can scroll the additional cards into the view.

|Attribute|Meaning|
|-|-|
|align-content:center|When so many standard cards like in dashboards are shown that they cannot be placed beside each other, they must be split into multiple rows. This attribute is for putting them above and below each other and to center them all in the cardstack. Without this attribute the rows would be stretched over the full height of the cardstack.|
|align-items:center|This is for centering standard cards horizontally in the cardstack|
|display:flex|With this the div is put into flexbox mode to enable centering and wrapping cards. Without setting this attribute to "flex" all of the alignment attributes would have no effect|
|flex:1|Defines that the cardstack uses all available space within the body|
|flex-wrap:wrap|Forces to wrap cards into multiple lines instead of shrinking their width|
|justify-content:center|Responsible for centering the cards vertically|

## .cardstack.listdetail > .card

|Attribute|Meaning|
|-|-|
|min-width:320px|This is the minimum width a card must have initially. This is used for automatic width calculation of the flexbox of the cardstack and is enough to show a list.|
|pointer-events:none|With this the mouse events regarding resizing the card are ignored on the card itself. Without this, the resize functionality would show strange behaviour when clicking in the card|
|position:relative|Defines the anchor position for the following resize handle which is positioned in an absolute way|

## .cardstack.listdetail > .card:after

TODO

## .cardstack.listdetail > .card:hover:after

TODO

## .cardstack.listdetail > .card:last-child

TODO

## .cardstack.listdetail > .card:last-child:after

TODO

## .mainmenu

TODO

## .toolbar

TODO
