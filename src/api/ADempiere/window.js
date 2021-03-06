// ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
// Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A.
// Contributor(s): Yamel Senih ysenih@erpya.com www.erpya.com
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

// Get Instance for connection
import { request } from '@/utils/ADempiere/request'

// Get list of log for a records
export function requestListEntityLogs({
  tableName,
  recordId,
  recordUuid,
  pageToken,
  pageSize
}) {
  return request({
    url: '/logs/list-entity-logs',
    method: 'post',
    data: {
      table_name: tableName,
      id: recordId,
      uuid: recordUuid
    },
    params: {
      // Page Data
      pageToken,
      pageSize
    }
  })
    .then(entityLogsListResponse => {
      const { convertEntityLog } = require('@/utils/ADempiere/apiConverts/window.js')

      return {
        nextPageToken: entityLogsListResponse.next_page_token,
        recordCount: entityLogsListResponse.record_count,
        entityLogsList: entityLogsListResponse.records.map(entityLog => {
          return convertEntityLog(entityLog)
        })
      }
    })
}

// Get workflow log for a record
export function requestListWorkflowsLogs({
  tableName,
  recordId,
  recordUuid,
  pageToken,
  pageSize
}) {
  return request({
    url: '/logs/list-workflow-logs',
    method: 'post',
    data: {
      table_name: tableName,
      id: recordId,
      uuid: recordUuid
    },
    params: {
      // Page Data
      pageToken,
      pageSize
    }
  })
    .then(workflowLogsListResponse => {
      const { convertWorkflowProcess } = require('@/utils/ADempiere/apiConverts/window.js')

      return {
        nextPageToken: workflowLogsListResponse.next_page_token,
        recordCount: workflowLogsListResponse.record_count,
        workflowLogsList: workflowLogsListResponse.records.map(workflowLog => {
          return convertWorkflowProcess(workflowLog)
        })
      }
    })
}

// Get workflow list for a document
export function requestListWorkflows({
  tableName,
  pageToken,
  pageSize
}) {
  return request({
    url: '/workflow/list-workflow',
    method: 'post',
    data: {
      table_name: tableName
    },
    params: {
      // Page Data
      pageToken,
      pageSize
    }
  })
    .then(workflowListResponse => {
      const { convertWorkflowDefinition } = require('@/utils/ADempiere/apiConverts/window.js')

      return {
        nextPageToken: workflowListResponse.next_page_token,
        recordCount: workflowListResponse.record_count,
        workflowsList: workflowListResponse.records.map(workflowDefinition => {
          return convertWorkflowDefinition(workflowDefinition)
        })
      }
    })
}

/**
 * @param {string}  tableName
 * @param {integer} recordId
 * @param {string}  pageToken
 * @param {string}  pageSize
 */
export function requestListEntityChats({
  tableName,
  recordId,
  recordUuid,
  pageToken,
  pageSize
}) {
  return request({
    url: '/logs/list-entity-chats',
    method: 'post',
    data: {
      table_name: tableName,
      id: recordId,
      uuid: recordUuid
    },
    params: {
      // Page Data
      pageToken,
      pageSize
    }
  })
    .then(entityChatListResponse => {
      const { convertEntityChat } = require('@/utils/ADempiere/apiConverts/window.js')

      return {
        nextPageToken: entityChatListResponse.next_page_token,
        recordCount: entityChatListResponse.record_count,
        entityChatsList: entityChatListResponse.records.map(entityChat => {
          return convertEntityChat(entityChat)
        })
      }
    })
}

/**
 * @param {string} uuid
 * @param {string} pageToken
 * @param {string} pageSize
 */
export function requestListChatsEntries({
  id,
  uuid,
  pageToken,
  pageSize
}) {
  return request({
    url: '/logs/list-chat-entries',
    method: 'post',
    data: {
      id,
      uuid
    },
    params: {
      // Page Data
      pageToken,
      pageSize
    }
  })
    .then(chatEntriesListResponse => {
      const { convertChatEntry } = require('@/utils/ADempiere/apiConverts/window.js')

      return {
        nextPageToken: chatEntriesListResponse.next_page_token,
        recordCount: chatEntriesListResponse.record_count,
        chatEntriesList: chatEntriesListResponse.records.map(chatEntry => {
          return convertChatEntry(chatEntry)
        })
      }
    })
}

/**
 * @param {string} tableName
 * @param {string} recordId
 * @param {string} recordUuid
 * @param {string} comment
 */
export function requestCreateChatEntry({
  tableName,
  recordId,
  recordUuid,
  comment
}) {
  return request({
    url: '/ui/create-chat-entry',
    method: 'post',
    data: {
      table_name: tableName,
      id: recordId,
      uuid: recordUuid,
      comment: comment
    }
  })
    .then(chatEntryResponse => {
      const { convertChatEntry } = require('@/utils/ADempiere/apiConverts/window.js')

      return convertChatEntry(chatEntryResponse)
    })
}

/**
 * Request Document Status List
 * @param {string} tableName
 * @param {number} recordId
 * @param {string} recordUuid
 * @param {string} documentStatus
 * @param {string} documentAction
 * @param {number} pageSize
 * @param {string} pageToken
 */
export function requestListDocumentStatuses({
  tableName,
  recordId,
  recordUuid,
  documentStatus,
  pageSize,
  pageToken
}) {
  return request({
    url: '/workflow/list-document-statuses',
    method: 'post',
    data: {
      id: recordId,
      uuid: recordUuid,
      table_name: tableName,
      document_status: documentStatus
    },
    params: {
      // Page Data
      pageToken,
      pageSize
    }
  })
    .then(listDocumentsActionsResponse => {
      return {
        nextPageToken: listDocumentsActionsResponse.next_page_token,
        recordCount: listDocumentsActionsResponse.record_count,
        documentStatusesList: listDocumentsActionsResponse.records
      }
    })
}

// Request a document action list from current status of document
export function requestListDocumentActions({
  tableName,
  recordId,
  recordUuid,
  documentStatus,
  documentAction,
  pageSize,
  pageToken
}) {
  return request({
    url: '/workflow/list-document-actions',
    method: 'post',
    data: {
      id: recordId,
      uuid: recordUuid,
      table_name: tableName,
      document_action: documentAction,
      document_status: documentStatus
    },
    params: {
      // Page Data
      pageToken,
      pageSize
    }
  })
    .then(listDocumentsActionsResponse => {
      return {
        nextPageToken: listDocumentsActionsResponse.next_page_token,
        recordCount: listDocumentsActionsResponse.record_count,
        defaultDocumentAction: {
          ...listDocumentsActionsResponse.default_document_action
        },
        documentActionsList: listDocumentsActionsResponse.records
      }
    })
}
