<template>
	<tr>
		<td>{{row.name}}</td>
		<td>
			<span v-if="!isEdit">{{row.pay_at}}</span>
			<el-date-picker v-else class="w-100" v-model="pay_at" type="date" required format="dd-MM-yyyy" value-format="dd-MM-yyyy"></el-date-picker>
		</td>
		<td>
			<span style="font-size: 14px;" class="badge text-medium" :class="{
				'badge-success': Number.isInteger(getDayDiff) && getDayDiff > 5,
				'badge-warning': Number.isInteger(getDayDiff) && getDayDiff < 6 && getDayDiff >= 0,
				'badge-danger': Number.isInteger(getDayDiff) && getDayDiff < 0,
			}">
				{{getStatus}}
			</span>
			<span v-if="row.must_pay_at" class="font-weight-bold"> - ({{ row.must_pay_at }})</span>
		</td>
		<td>{{getType}}</td>
		<td>
			<button class="btn btn-success" @click="editRow">
				{{ !isEdit ? 'Sửa' : 'Cập nhật' }}
			</button>
			<button v-if="isEdit" class="btn btn-warning ml-2" @click="isEdit = false">
				Hủy
			</button>
		</td>
	</tr>
</template>

<script>

	import moment from 'moment'

	export default {
		name: "Row",
		props: ["row", 'rowIndex'],

		data() {
			return {
				isEdit: false,
				pay_at: '',
			}
		},

		watch: {
			isEdit(value) {
				if(value) {
					this.pay_at = this.row.pay_at
				} else {
					this.pay_at = ''
				}
			}
		},

		computed: {

			getDayDiff() {

				if(this.row.pay_at && this.row.must_pay_at) {

					// const pay = moment(this.row.pay_at, "DD-MM-YYYY");
					const currentDay = moment();
					const must_pay = moment(this.row.must_pay_at, "DD-MM-YYYY");

					const diff = must_pay.diff(currentDay, 'days');

					return diff;

				}

				return '';
			},

			getStatus() {

				if(Number.isInteger(this.getDayDiff)) {
					if(this.getDayDiff >= 0) {
						return `Còn ${this.getDayDiff} ngày`;
					} else {
						return `Trễ ${-this.getDayDiff} ngày`;
					}
				}

				return '';
			},

			getType() {
				if(this.row.type) {
					if(+this.row.type === 1)
						return '3 buổi';
					else if(+this.row.type === 2)
						return '5 buổi';

					return this.row.type;
				}

				return '';
			},
		},

		methods: {
			editRow() {
				if(!this.isEdit) {
					this.isEdit = true
				} else {
					const rawData = {
						pay_at: this.pay_at,
						updated_at: moment().format('DD-MM-YYYY HH:mm:ss'),
						must_pay_at: moment(this.pay_at, "DD-MM-YYYY").add(1, 'months').format('DD-MM-YYYY')
					}
					this.$emit('update', this.rowIndex, rawData);
					this.isEdit = false;
				}
			}
		}
	}
	
</script>

<style scoped>

</style>