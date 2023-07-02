<template>
	<div class="container-fluid">
		<div class="row">
			<main role="main" class="col-md-12 ml-sm-auto col-lg-12 pt-3 px-4">
				<div class="container">
					<div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mt-3 ">
						<h4 class="mb-3">Tạo mới</h4>
						<div class="btn-toolbar mb-2 mb-md-0">
							<router-link to="/"  class="btn btn-sm mr-1 btn-outline-secondary">
								Trở lại
							</router-link>
						</div>
					</div>
					<div v-if="showMsg" class="alert alert-success alert-dismissible fade show" role="alert">
						{{message}}
						<button type="button" class="close" data-dismiss="alert" aria-label="Close">
							<span aria-hidden="true">&times;</span>
						</button>
					</div>
					<div class="col-md-12 order-md-1">
						<form @submit.prevent="addRow">
							<div class="row">
								<div class="col-md-6 mb-3">
									<label>Họ và tên</label>
									<input type="text" v-model="name" class="form-control" id="name">

									<span v-if="!name && isFormValid === false" class="text-danger mt-1 d-block">Bắt buộc điền</span>

								</div>
								<div class="col-md-6 mb-3">
									<label>Loại buổi học</label>
									<select class="form-control" name="type" v-model="type">
										<option value="1">3 buổi</option>
										<option value="2">5 buổi</option>
									</select>

									<span v-if="!type && isFormValid === false" class="text-danger mt-1 d-block">Bắt buộc điền</span>
								</div>
								<div class="col-md-6">
									<label>Ngày đóng tiền</label>
									<div>
										<el-date-picker class="w-100" v-model="pay_at" type="date" required format="dd-MM-yyyy" value-format="dd-MM-yyyy"></el-date-picker>
									</div>
									<span v-if="!pay_at && isFormValid === false" class="text-danger mt-1 d-block">Bắt buộc điền</span>
								</div>
								<div class="col-md-6">
									<label style="opacity: 0;">.</label>
									<button class="btn btn-success btn-block" type="submit">Tạo</button>
								</div>
								
							</div>		
						</form>
					</div>

					
				</div>
				
			</main>
		</div>
	</div>
</template>

<script>

	import moment from 'moment'

	const { GoogleSpreadsheet } = require('google-spreadsheet');
	const creds = require('@/client_secret.json');
	export default {
		name: "AddRow",
		data() {
			return {
				name: '',
				type: '',
				created_at: '',
				pay_at: '',

				isFormValid: null,

				showMsg : false,
				message: '',

			}
		},

		methods: {

			_validate() {
				if(!this.name || !this.type || !this.pay_at) 
					this.isFormValid = false;
				else 
					this.isFormValid = true;
			},

			async addRow() {

				this._validate();

				if(!this.isFormValid) return;

				const newRow = {
					name: this.name,
					type: this.type,
					pay_at: this.pay_at,
					created_at: moment().format('DD-MM-YYYY HH:mm:ss'),
					must_pay_at: moment(this.pay_at, "DD-MM-YYYY").add(1, 'months').format('DD-MM-YYYY')
				}

				const doc = new GoogleSpreadsheet('1H3AEpvT5i3JCpp_YQhcfFsV5PoB4hixBWCqro82pNCc');
				await doc.useServiceAccountAuth(creds);
				await doc.loadInfo(); 
				const sheet = doc.sheetsByIndex[0];
				await sheet.addRow(newRow);

				this.$notify.success({
					title: 'Thành công',
					message: 'Tạo mới thành công!'
				});

				this.$router.push('/');

				this.message = "Tạo mới thành viên thành công!";
				this.showMsg = true;

			}
		}
	}
</script>

<style scoped>

</style>
