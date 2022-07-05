// Koan Data v0.0.1 Type Definitions

export interface KoanBase {
  /**
   * Always true for a Koan board
   */
  koan_board: true
  /**
   * Semver version string of the file, equal to the version of the program that last saved it
   */
  version: string
}

export interface KoanMeta {
  /**
   * The user defined name of the board
   */
  name: string
  /**
   * The computer generated name of the board that can be safely used as a file name
   */
  safeName: string
  /**
   * UTC ISO datetime string of when the board was first created
   */
  created_at: string
  /**
   * UTC ISO datetime string of when the board was last updated
   */
  updated_at: string
  /**
   * Name of the author. Can be anything, but expected to contain `Firstname Lastname <email@example.com>`
   */
  author: string
  /**
   * The remote origin were the board is synced
   * @nullable
   */
  remote: {
    /**
     * Full URL of the remote origin
     */
    url: string
  }
}

export interface KoanChecklistItem {
  /**
   * All properties of the checklist item
   */
  properties: {
    /**
     * User-defined checklist item description
     */
    description: string
    /**
     * User-defined UTC ISO datetime string of when the checklist item is due. If null, no due date has been defined
     * @nullable
     */
    due_date: string
    /**
     * UTC ISO datetime string of when the checklist item has been marked completed. If null, the checklist item is not yet completed
     * @nullable
     */
    completed: string
  }
}

export interface KoanChecklist {
  /**
   * Unique ID for the checklist. starts with `koan-chk-`
   */
  id: string
  /**
   * All properties of the checklist
   */
  properties: {
    /**
     * User-defined name of the checklist
     * @nullable
     */
    name: string
  }
  items: KoanChecklistItem[]
}

export interface KoanAttachment {
  /**
   * Unique ID for the attachment. starts with `koan-att-`
   */
  id: string
  /**
   * The mime-type of the attachment. Example: `image/png`
   */
  type: string
  /**
   * The format in which the content is stored
   */
  format: 'base64' | 'file'
}

export interface KoanEmbeddedAttachment extends KoanAttachment {
  /**
   * @override
   */
  format: 'base64'
  /**
   * All properties of the embedded attachment
   */
  properties: {
    /**
     * Original uploaded file name with extension
     */
    name: string
    /**
     * Base64 encoded content
     */
    content: string
  }
}

export interface KoanDiskAttachment extends KoanAttachment {
  /**
   * @override
   */
  format: 'file'
  /**
   * All properties of the disk attachment
   */
  properties: {
    /**
     * Original uploaded file name with extension
     */
    name: string
    /**
     * Relative path inside the Koan attachments folder to the file. Will end with the id followed by the original extension
     */
    path: string
  }
}

export interface KoanReaction {
  /**
   * Unique ID for the reaction. starts with `koan-rea-`
   */
  id: string
  /**
   * UTC ISO datetime string of when the reaction was first created
   */
  created_at: string
  /**
   * Name of the author. Can be anything, but expected to contain `Firstname Lastname <email@example.com>`
   */
  author: string
  /**
   * All properties of the reaction
   */
  properties: {
    /**
     * Single character emoji that represents the reaction
     */
    emoji: string
  }
}

export interface KoanComment {
  /**
   * Unique ID for the comment. starts with `koan-cmt-`
   */
  id: string
  /**
   * UTC ISO datetime string of when the comment was first created
   */
  created_at: string
  /**
   * UTC ISO datetime string of when the comment was last updated
   */
  updated_at: string
  /**
   * Name of the author. Can be anything, but expected to contain `Firstname Lastname <email@example.com>`
   */
  author: string
  /**
   * All properties of the comment
   */
  properties: {
    /**
     * User-defined content of the comment. Rendered as markdown
     */
    content: string
  }
  /**
   * All the attachments of the comment
   */
  attachments: KoanAttachment[]
  /**
   * All the responses to the comment
   */
  comments: KoanComment[]
  /**
   * All reactions to the comment
   */
  reactions: KoanReaction[]
}

export interface KoanCard {
  /**
   * Unique ID for the card. starts with `koan-crd-`
   */
  id: string
  /**
   * UTC ISO datetime string of when the card was first created
   */
  created_at: string
  /**
   * All properties of the list
   */
  properties: {
    /**
     * User-defined name of the card
     */
    name: string
    /**
     * User-defined description of the card. Rendered as markdown
     * @nullable
     */
    description: string
    /**
     * User-defined UTC ISO datetime string of when the card starts. If null, no start date has been defined
     * @nullable
     */
    start_date: string
    /**
     * User-defined UTC ISO datetime string of when the card is due. If null, no due date has been defined
     * @nullable
     */
    due_date: string
    /**
     * UTC ISO datetime string of when the card has been marked completed. If null, the card is not yet completed
     * @nullable
     */
    completed: string
    /**
     * IDs of all the labels of this card. References `KoanData.labels`
     */
    labels: string[]
    /**
     * If true and there are images attached to the card, the first one will be used as cover image
     */
    use_first_image_as_cover: boolean
  }
  /**
   * All the checklists of the card
   */
  checklists: KoanChecklist[]
  /**
   * All the attachments of the card
   */
  attachments: KoanAttachment[]
  /**
   * All the comments of the card
   */
  comments: KoanComment[]
}

export interface KoanList {
  /**
   * Unique ID for the list. starts with `koan-lst-`
   */
  id: string
  /**
   * UTC ISO datetime string of when the board was first created
   */
  created_at: string
  /**
   * All properties of the list
   */
  properties: {
    /**
     * User-defined name of the list
     */
    name: string
    /**
     * User-defined UTC ISO datetime string of when the list starts. If null, no start date has been defined
     * @nullable
     */
    start_date: string
    /**
     * User-defined UTC ISO datetime string of when the list is due. If null, no due date has been defined
     * @nullable
     */
    due_date: string
    /**
     * UTC ISO datetime string of when the list has been marked completed. If null, the list is not yet completed
     * @nullable
     */
    completed: string
  }
  /**
   * All the cards of the list
   */
  cards: KoanCard[]
}

export interface KoanBoard {
  /**
   * All the lists of the board
   */
  lists: {
    /**
     * All active lists
     */
    active: KoanList[]
    /**
     * All archived lists
     */
    archived: KoanList[]
  }
}

export interface KoanLabel {
  /**
   * Unique ID for the label. starts with `koan-lbl-`
   */
  id: string
  /**
   * All properties of the label
   */
  properties: {
    /**
     * HEX color string. Format: `#rrggbb`
     */
    color: string
    /**
     * User-defined text of the label
     * @nullable
     */
    text: string
  }
}

export interface KoanData {
  /**
   * The board data
   */
  board: KoanBoard
  /**
   * All the labels saved with the board indexed by their id
   */
  labels: { [x: string]: KoanLabel }
}

export interface Koan extends KoanBase {
  /**
   * All the metadata of the board
   */
  meta: KoanMeta
  /**
   * All the data of the board
   */
  data: KoanData

  /**
   * @override
   */
  version: "v0.0.1"
}
