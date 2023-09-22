const kundli = require('../models/kundali');



exports.AddKundli = async (req, res) => {
    try {
        const data = {
            name: req.body.name,
            gender: req.body.gender,
            DOB: req.body.DOB,
            time: req.body.time,
            place: req.body.place
        }
        const kundilData = await kundli.create(data);
        return res.status(200).json({
            details: kundilData
        })
    } catch (err) {
        console.log(err);
        return res.status(400).json({
            message: err.message
        })
    }
}

exports.getKundli = async (req, res) => {
    try {
        const data = await kundli.find();

        return res.status(200).json({
            details: data
        })
    } catch (err) {
        return res.status(400).json({
            message: err.message
        })
    }
}


exports.updateKundil = async (req, res) => {
    try {
        await kundli.findByIdAndUpdate({ _id: req.params.id }, {
            name: req.body.name,
            gender: req.body.gender,
            DOB: req.body.DOB,
            time: req.body.time,
            place: req.body.place
        });
        res.status(200).json({
            details: "updated "
        })
    } catch (err) {
        console.log(err);
        return res.status(400).json({
            message: err.message
        })
    }
}



exports.deleteKundil = async (req, res) => {
    try {
        await kundli.findByIdAndDelete({ _id: req.params.id })
        return res.status(200).json({
            message: "Deleted  "
        })
    } catch (err) {
        console.log(err);
        return res.status(400).json({
            message: err.message
        })
    }
}