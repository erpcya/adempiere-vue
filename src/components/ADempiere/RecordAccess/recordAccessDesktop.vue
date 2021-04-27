<!--
 ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A.
 Contributor(s): Elsio Sanchez esanchez@erpya.com www.erpya.com
 This program is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with this program.  If not, see <https:www.gnu.org/licenses/>.
-->
<template>
  <div>
    <div class="board">
      <div
        :key="1"
        class="kanban todo"
        header-text="Todo"
        style="padding: 0px;margin: 0px;width: 300px;"
      >
        <div class="board-column">
          <div class="board-column-header">
            {{ $t('data.recordAccess.hideRecord') }} ({{ excludedList.length }})
          </div>
          <el-scrollbar wrap-class="scroll-child">
            <draggable
              v-model="excludedList"
              :group="group"
              v-bind="$attrs"
              class="board-column-content"
            >
              <div
                v-for="element in excludedList"
                :key="element.roleId"
                class="board-item"
              >
                {{ element.roleName }}
              </div>

            </draggable>
          </el-scrollbar>
        </div>
      </div>
      <div
        :key="2"
        class="kanban working"
        header-text="Working"
        style="padding: 0px;margin: 0px;width: 600px;"
      >
        <div class="board-column">
          <div class="board-column-header">
            {{ $t('data.recordAccess.recordDisplay') }} {{ includedList.length }}
          </div>
          <el-scrollbar wrap-class="scroll-child">
            <draggable
              v-model="includedList"
              :group="group"
              v-bind="$attrs"
              class="board-column-content"
              @change="handleChange"
            >
              <div
                v-for="(element, index) in includedList"
                :key="element.roleId"
                class="board-item"
                style="height: 50%;padding-left: 0px;padding-right: 0px;"
              >
                <el-table
                  v-if="!isEmptyValue(includedList)"
                  :data="[includedList[index]]"
                  border
                  :show-header="false"
                >
                  <el-table-column
                    prop="roleName"
                  />
                  <el-table-column
                    fixed="right"
                    width="120"
                  >
                    <template slot-scope="scope">
                      {{ $t('data.recordAccess.isReadonly') }} <el-checkbox v-model="scope.row.isReadOnly" />
                    </template>
                  </el-table-column>
                  <el-table-column
                    fixed="right"
                  >
                    <template slot-scope="scope">
                      {{ $t('data.recordAccess.isDependentEntities') }} <el-checkbox v-model="scope.row.isDependentEntities" />
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </draggable>
          </el-scrollbar>
        </div>
      </div>
    </div>
    <span slot="footer" class="dialog-footer" style="position: absolute;right: 1.99%;bottom: 3%;">
      <el-button
        type="danger"
        icon="el-icon-close"
        @click="close"
      />
      <el-button
        type="primary"
        icon="el-icon-check"
        @click="sendRecordAcces(includedList)"
      />
    </span>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import { getRecordAccess, setRecordAccess } from '@/api/ADempiere/actions/record-access.js'
export default {
  name: 'RecordAccessDesktop',
  components: {
    draggable
  },
  props: {
    parentUuid: {
      type: String,
      default: undefined
    },
    containerUuid: {
      type: String,
      default: undefined
    },
    order: {
      type: String,
      default: undefined
    },
    included: {
      type: String,
      default: undefined
    },
    keyColumn: {
      type: String,
      default: undefined
    },
    identifiersList: {
      type: Array,
      default: undefined
    }
  },
  data() {
    return {
      group: 'sequence',
      isReadonly: false,
      isDependentEntities: true,
      recordAccess: {
        tableName: '',
        recordId: 0,
        recordUuid: '',
        roles: []
      }
    }
  },
  computed: {
    excludedList: {
      get() {
        if (this.recordAccess.roles) {
          return this.recordAccess.roles.filter(role => !role.isPersonalLock)
        } else {
          return []
        }
      },
      set(value) {
      }
    },
    includedList: {
      get() {
        if (this.recordAccess.roles) {
          return this.recordAccess.roles.filter(role => role.isPersonalLock)
        } else {
          return []
        }
      },
      set(value) {
      }
    },
    getIdentifiersList() {
      return this.identifiersList
        .filter(item => item.componentPath !== 'FieldSelect')
    }
  },
  created() {
    getRecordAccess({
      tableName: 'M_Product_Group',
      recordId: 1000000
    })
      .then(access => {
        this.recordAccess.tableName = access.tableName
        this.recordAccess.recordId = access.recordId
        this.recordAccess.recordUuid = access.recordUuid
        access.availableRoles.forEach(role => {
          this.recordAccess.roles.push({
            ...role,
            isPersonalLock: false
          })
        })
        access.currentRoles.forEach(role => {
          this.recordAccess.roles.push({
            ...role,
            isPersonalLock: true
          })
        })
      })
  },
  methods: {
    handleChange(value) {
      const action = Object.keys(value)[0] // get property
      const element = value[action].element
      const index = this.recordAccess.roles.findIndex(role => role.roleId === element.roleId)
      switch (action) {
        case 'added':
          this.addItem({
            index,
            element
          })
          break
        case 'removed':
          this.deleteItem({
            index,
            element
          })
          break
      }
    },
    /**
     * @param {number} index: the index of the added element
     * @param {object} element: the added element
     */
    addItem({
      index,
      element
    }) {
      this.recordAccess.roles[index].isPersonalLock = true
    },
    /**
     * @param {number} index: the index of the element before remove
     * @param {object} element: the removed element
     */
    deleteItem({
      index,
      element
    }) {
      this.recordAccess.roles[index].isPersonalLock = false
    },
    getOrder(arrayToSort, orderBy = this.order) {
      return arrayToSort.sort((itemA, itemB) => {
        return itemA[orderBy] - itemB[orderBy]
      })
    },
    sendRecordAcces(recordAccesses) {
      setRecordAccess({
        tableName: 'M_Product_Group',
        recordId: 1000000,
        recordAccesses
      })
        .then(responseRercord => {
          console.log({
            responseRercord
          })
        })
      this.close()
    },
    close() {
      this.$store.dispatch('setShowDialog', {
        type: 'window',
        action: undefined
      })
      this.$store.commit('setRecordAccess', false)
    }
  }
}
</script>

<style lang="scss" scoped>
  .board-column {
    min-width: 250px;
    min-height: 70px;
    height: auto;
    overflow: hidden;
    background: #f0f0f0;
    border-radius: 3px;

    .board-column-header {
      height: 50px;
      line-height: 50px;
      overflow: hidden;
      padding: 0 20px;
      text-align: center;
      background: #333;
      color: #fff;
      border-radius: 3px 3px 0 0;
    }

    .board-column-content {
      height: auto;
      overflow: hidden;
      border: 10px solid transparent;
      min-height: 60px;
      display: flex;
      justify-content: flex-start;
      flex-direction: column;
      align-items: center;

      .board-item {
        cursor: pointer;
        width: 100%;
        height: 30px;
        margin: 5px 0;
        background-color: #fff;
        text-align: left;
        line-height: 30px;
        padding: 0px 10px;
        box-sizing: border-box;
        box-shadow: 0px 1px 3px 0 rgba(0, 0, 0, 0.2);
      }
    }
  }
</style>
<style lang="scss">
  .board {
    height: 400px;
    width: 100%;
    margin-left: 20px;
    display: flex;
    justify-content: space-around;
    flex-direction: row;
    align-items: flex-start;
  }
  .kanban {
    &.todo {
      .board-column-header {
        background: #f9944a;
      }
    }
    &.working {
      .board-column-header {
        background: #4A9FF9;
      }
    }
  }
</style>
