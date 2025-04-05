let listOfTask = [
	{
		id: 1,
		title: "Cycling",
		limit: {
			qty: 13,
			unit: "week"
		},
		target: {
			qty: 30,
			unit: "min"
		},
		except: {
			qty: { 5, 14, 28 }
			unit: "month"
		}
	},
	{
		id: 2,
		title: "Yoga",
		limit: {
			qty: 13,
			unit: "week"
		},
		target: {
			qty: 30,
			unit: "min"
		},
		except: {
			qty: { 1, 4 }
			unit: "week"
		}
	},
	{
		id: 3,
		title: "WorkOut",
		limit: {
			qty: 13,
			unit: "week"
		},
		target: {
			qty: 30,
			unit: "min"
		},
		except: {
			qty: {
				{ 1, 1 },
				{ 2, 28 },
				{ 12, 31 }
			}
			unit: "year"
		}
	},
	{
		id: 4,
		title: "Training",
		limit: {
			qty: 30,
			unit: "day"
		},
		target: {},
		exception: "week"
	},
]