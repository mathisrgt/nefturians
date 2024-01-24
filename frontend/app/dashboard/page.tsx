'use client';

import { useState, useEffect } from 'react';
import { Button } from "@nextui-org/button";
import { Card, CardHeader, CardBody, Divider, Image, Table, TableBody, TableRow, TableColumn, TableCell, TableHeader } from "@nextui-org/react";

export default function Dashboard() {
    const [nefturianNb, setNefturianNb] = useState(0);
    const [name, setName] = useState('');
    const [imageURL, setImageURL] = useState('');
    const [description, setDescription] = useState('');
    const [nefturianSide, setNefturianSide] = useState(0);

    /**
    * This function makes an HTTP request to retrieve the side of the Nefturian associated with a given number.
    * @param {number} nefturianNb - Side number
    */
    function fetchNefturianSide() {
        fetch(`http://localhost:3000/side/${nefturianNb}`)
            .then(response => response.json())
            .then(data => {
                setNefturianSide(data.nefturianSideNb);
            })
            .catch(error => {
                console.error('Erreur lors de la récupération du côté du Nefturian :', error);
            });
    };

    /**
    * This function makes an HTTP POST request to set the side of a Nefturian to a specified value.
    * @param {number} side - The side value to set for the Nefturian (1 => Cyberians / 2 => Samurians / 3 => Lone wolf)
    */
    function handleChooseSide(side: Number) {
        fetch(`http://localhost:3000/setside/${nefturianNb}/${side}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(response => response.json())
            .then(data => {
                setNefturianSide(data.side);
            })
            .catch(error => {
                console.error('Erreur lors de la sélection du côté du Nefturian :', error);
            });
    }

    useEffect(() => {
        const userAddress = localStorage.getItem('userAddress');

        console.log('User address is: ' + userAddress);

        if (userAddress) {
            /* Fetch index to get the nefturian id linked to the address */
            fetch("http://localhost:3000/index", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ address: userAddress }),
            })
                .then(response => response.json()) //
                .then(data => { // Get the nefturian data
                    const nefturianIndex = data.nefturianIndex;
                    setNefturianNb(nefturianIndex);

                    const dataUrl = 'https://api.nefturians.io/metadata/' + nefturianIndex;

                    return fetch(dataUrl);
                })
                .then(response => { // Return the response, Error handler
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => { // Set data in local variables
                    setName(data.name);
                    setImageURL(data.image);
                    setDescription(data.description);
                })
                .catch(error => {
                    console.error('Erreur lors de la requête vers l\'API:', error);
                });
        }
    }, []);

    useEffect(() => {
        fetchNefturianSide(); // Get the nefturian side (1 => Cyberians / 2 => Samurians / 3 => Lone wolf)
        console.log("La valeur du nefturianSide est : " + nefturianSide);
    }, [nefturianNb]);

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <Table hideHeader className="w-2/3">
                <TableHeader>
                    <TableColumn>Image</TableColumn>
                    <TableColumn>Infomation</TableColumn>
                </TableHeader>
                <TableBody>
                    <TableRow>
                        <TableCell>
                            <Image src={imageURL} alt="Picture of a Nefturian" />
                        </TableCell>
                        <TableCell className="w-1/2">
                            <Card>
                                <CardHeader>
                                    <p><strong>{name}</strong></p>
                                </CardHeader>
                                <Divider />
                                <CardBody>
                                    <p><strong>Description:</strong> {description}</p>
                                </CardBody>
                                {nefturianSide == 1 && (
                                    <>
                                        <Button size="md" variant="bordered" color="primary" className="mx-auto w-98 m-1" disabled>Cyberians</Button>
                                    </>
                                )}
                                {nefturianSide == 2 && (
                                    <>
                                        <Button size="md" variant="bordered" color="danger" className="mx-auto w-98 m-1" disabled>Samurians</Button>
                                    </>
                                )}
                                {nefturianSide == 3 && (
                                    <>
                                        <Divider />
                                        <p className="mx-auto m-2">⚔️ Choose a side ⚔️</p>
                                        <Button size="md" variant="solid" color="primary" className="w-95 m-1" onClick={() => handleChooseSide(1)}>Cyberians</Button>
                                        <Button size="md" variant="solid" color="danger" className="w-95 m-1" onClick={() => handleChooseSide(2)}>Samurians</Button>
                                    </>)}
                            </Card>
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </main>
    )
}