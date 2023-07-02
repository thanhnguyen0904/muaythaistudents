<template>
	<div class="container-fluid">
		<div class="row">
			<main role="main" class="col-md-12 ml-sm-auto col-lg-12 pt-3 px-4">
				<div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-3 ">
					<!-- <div class="btn-toolbar mb-2 mb-md-0">
						<a 	href="https://docs.google.com/spreadsheets/d/1oLGI1u68sPh-P1yhWaU7j_WUTHjFMY1aUu6uINfTb0Q/edit?usp=sharing" 
							class="btn btn-sm btn-outline-secondary"
							target="_blank">
						View Google Sheet
						</a>
					</div> -->
				</div>
				<div class="table-responsive">
					<table v-if="!loading" class="table" style="min-width: 750px;">
						<thead>
						<tr>
							<th width="200px">Tên</th>
							<th width="300px">Ngày đóng tiền</th>
							<th>Ngày đóng tiền tiếp theo</th>
							<th>Số buổi</th>
							<th width="200px">Chỉnh sửa</th>
						</tr>
						</thead>
						
						<tbody>
							<Row v-bind:key="rowIndex" v-for="(row, rowIndex) in rows" v-bind:row="row" v-bind:row-index="rowIndex" @update="editSpecificRow" />
						</tbody>
					</table>

					<div v-else>
						<h5 class="text-center">....Loading</h5>
					</div>

				</div>
			</main>
		</div>
	</div>
</template>
 
<script>
import Row from '@/components/Row.vue';
const { GoogleSpreadsheet } = require('google-spreadsheet');
const creds = require('@/client_secret.json');
	export default {
		name: "Sheet",
		components: {
			Row
		},
		props: ["sheet"],
		data() {
			return {
				rows: [],
				loading: false,
				document: null
			}
		},
		methods:{
			async accessSpreadSheet() {
				const doc = new GoogleSpreadsheet('1H3AEpvT5i3JCpp_YQhcfFsV5PoB4hixBWCqro82pNCc');
				await doc.useServiceAccountAuth(creds);
				await doc.loadInfo(); 

				this.document = doc;

				const sheet = doc.sheetsByIndex[0];
				const rows = await sheet.getRows({
					offset: 0
				});

				this.rows = rows;

				this.loading = false;
			},

			async editSpecificRow(rowIndex, rawData) {

				if(!this.document || !rawData) {
					this.$notify.error({
						title: 'Lỗi',
						message: 'Có lỗi xảy ra'
					});

					return;
				}

				const sheet = this.document.sheetsByIndex[0];

				const specificRows = await sheet.getRows({offset: rowIndex, limit: 1});

				if(specificRows && specificRows.length > 0) {
					const specificRow = specificRows[0];

					if(specificRow._rawData && specificRow._rawData.length > 0) {
						specificRow._rawData[3] = rawData.updated_at;
						specificRow._rawData[4] = rawData.pay_at;
						specificRow._rawData[5] = rawData.must_pay_at;

						await specificRow.save();

						this.$notify.success({
							title: 'Cập nhật',
							message: 'Đã cập nhật lần đóng tiền tiếp theo thành công!'
						});

						const rows = await sheet.getRows({
							offset: 0
						});

						this.rows = rows;
					}
				}

			}

		},
		created() {
			this.loading = true;
			this.accessSpreadSheet();
		}
		
	}
</script>

<style scoped>

</style>